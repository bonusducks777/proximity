// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

contract SocialMediaProfile {
    // Events
    event PostCreated(uint256 indexed postId, address indexed author, uint256 timestamp);
    event PostUpdated(uint256 indexed postId, uint256 timestamp);
    event PostDeleted(uint256 indexed postId, uint256 timestamp);
    event FriendAdded(address indexed friend, uint256 timestamp);
    event FriendRemoved(address indexed friend, uint256 timestamp);
    event ProfileUpdated(uint256 timestamp);

    // Structs
    struct Post {
        uint256 id;
        string content;
        string imageHash; // IPFS hash or other storage hash
        uint256 timestamp;
        bool isDeleted;
        uint256 likes;
        mapping(address => bool) likedBy;
    }

    struct Profile {
        string username;
        string bio;
        string profileImageHash;
        string coverImageHash;
        uint256 createdAt;
        uint256 updatedAt;
        bool isActive;
    }

    // State variables
    address public owner;
    Profile public profile;
    
    uint256 public postCount;
    mapping(uint256 => Post) public posts;
    uint256[] public postIds;
    
    address[] public friends;
    mapping(address => bool) public isFriend;
    mapping(address => uint256) public friendIndex;
    
    // Modifiers
    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner can call this function");
        _;
    }

    modifier postExists(uint256 _postId) {
        require(_postId <= postCount && _postId > 0, "Post does not exist");
        require(!posts[_postId].isDeleted, "Post has been deleted");
        _;
    }

    constructor(
        string memory _username,
        string memory _bio,
        string memory _profileImageHash
    ) {
        owner = msg.sender;
        
        profile = Profile({
            username: _username,
            bio: _bio,
            profileImageHash: _profileImageHash,
            coverImageHash: "",
            createdAt: block.timestamp,
            updatedAt: block.timestamp,
            isActive: true
        });

        emit ProfileUpdated(block.timestamp);
    }

    // Profile functions
    function updateProfile(
        string memory _username,
        string memory _bio,
        string memory _profileImageHash,
        string memory _coverImageHash
    ) external onlyOwner {
        profile.username = _username;
        profile.bio = _bio;
        profile.profileImageHash = _profileImageHash;
        profile.coverImageHash = _coverImageHash;
        profile.updatedAt = block.timestamp;

        emit ProfileUpdated(block.timestamp);
    }

    function deactivateProfile() external onlyOwner {
        profile.isActive = false;
        profile.updatedAt = block.timestamp;
        emit ProfileUpdated(block.timestamp);
    }

    function activateProfile() external onlyOwner {
        profile.isActive = true;
        profile.updatedAt = block.timestamp;
        emit ProfileUpdated(block.timestamp);
    }

    // Post functions
    function createPost(
        string memory _content,
        string memory _imageHash
    ) external onlyOwner returns (uint256) {
        postCount++;
        uint256 newPostId = postCount;
        
        Post storage newPost = posts[newPostId];
        newPost.id = newPostId;
        newPost.content = _content;
        newPost.imageHash = _imageHash;
        newPost.timestamp = block.timestamp;
        newPost.isDeleted = false;
        newPost.likes = 0;
        
        postIds.push(newPostId);

        emit PostCreated(newPostId, owner, block.timestamp);
        return newPostId;
    }

    function updatePost(
        uint256 _postId,
        string memory _content,
        string memory _imageHash
    ) external onlyOwner postExists(_postId) {
        Post storage post = posts[_postId];
        post.content = _content;
        post.imageHash = _imageHash;

        emit PostUpdated(_postId, block.timestamp);
    }

    function deletePost(uint256 _postId) external onlyOwner postExists(_postId) {
        posts[_postId].isDeleted = true;
        emit PostDeleted(_postId, block.timestamp);
    }

    function likePost(uint256 _postId) external postExists(_postId) {
        require(!posts[_postId].likedBy[msg.sender], "Already liked this post");
        
        posts[_postId].likedBy[msg.sender] = true;
        posts[_postId].likes++;
    }

    function unlikePost(uint256 _postId) external postExists(_postId) {
        require(posts[_postId].likedBy[msg.sender], "Haven't liked this post");
        
        posts[_postId].likedBy[msg.sender] = false;
        posts[_postId].likes--;
    }

    // Friends functions
    function addFriend(address _friend) external onlyOwner {
        require(_friend != address(0), "Invalid friend address");
        require(_friend != owner, "Cannot add yourself as friend");
        require(!isFriend[_friend], "Already a friend");

        friends.push(_friend);
        isFriend[_friend] = true;
        friendIndex[_friend] = friends.length - 1;

        emit FriendAdded(_friend, block.timestamp);
    }

    function removeFriend(address _friend) external onlyOwner {
        require(isFriend[_friend], "Not a friend");

        uint256 indexToRemove = friendIndex[_friend];
        uint256 lastIndex = friends.length - 1;

        // Move the last element to the position of the element to remove
        if (indexToRemove != lastIndex) {
            address lastFriend = friends[lastIndex];
            friends[indexToRemove] = lastFriend;
            friendIndex[lastFriend] = indexToRemove;
        }

        // Remove the last element
        friends.pop();
        delete isFriend[_friend];
        delete friendIndex[_friend];

        emit FriendRemoved(_friend, block.timestamp);
    }

    // View functions
    function getProfile() external view returns (
        string memory username,
        string memory bio,
        string memory profileImageHash,
        string memory coverImageHash,
        uint256 createdAt,
        uint256 updatedAt,
        bool isActive,
        address profileOwner
    ) {
        return (
            profile.username,
            profile.bio,
            profile.profileImageHash,
            profile.coverImageHash,
            profile.createdAt,
            profile.updatedAt,
            profile.isActive,
            owner
        );
    }

    function getPost(uint256 _postId) external view postExists(_postId) returns (
        uint256 id,
        string memory content,
        string memory imageHash,
        uint256 timestamp,
        uint256 likes,
        address author
    ) {
        Post storage post = posts[_postId];
        return (
            post.id,
            post.content,
            post.imageHash,
            post.timestamp,
            post.likes,
            owner
        );
    }

    function getAllPosts() external view returns (
        uint256[] memory ids,
        string[] memory contents,
        string[] memory imageHashes,
        uint256[] memory timestamps,
        uint256[] memory likeCounts
    ) {
        uint256 activePostCount = 0;
        
        // Count active posts
        for (uint256 i = 0; i < postIds.length; i++) {
            if (!posts[postIds[i]].isDeleted) {
                activePostCount++;
            }
        }

        // Initialize arrays
        ids = new uint256[](activePostCount);
        contents = new string[](activePostCount);
        imageHashes = new string[](activePostCount);
        timestamps = new uint256[](activePostCount);
        likeCounts = new uint256[](activePostCount);

        // Populate arrays with active posts
        uint256 currentIndex = 0;
        for (uint256 i = 0; i < postIds.length; i++) {
            uint256 postId = postIds[i];
            if (!posts[postId].isDeleted) {
                Post storage post = posts[postId];
                ids[currentIndex] = post.id;
                contents[currentIndex] = post.content;
                imageHashes[currentIndex] = post.imageHash;
                timestamps[currentIndex] = post.timestamp;
                likeCounts[currentIndex] = post.likes;
                currentIndex++;
            }
        }
    }

    function getFriends() external view returns (address[] memory) {
        return friends;
    }

    function getFriendCount() external view returns (uint256) {
        return friends.length;
    }

    function getPostCount() external view returns (uint256) {
        uint256 activePostCount = 0;
        for (uint256 i = 0; i < postIds.length; i++) {
            if (!posts[postIds[i]].isDeleted) {
                activePostCount++;
            }
        }
        return activePostCount;
    }

    function hasLikedPost(uint256 _postId, address _user) external view postExists(_postId) returns (bool) {
        return posts[_postId].likedBy[_user];
    }

    function getLatestPosts(uint256 _count) external view returns (
        uint256[] memory ids,
        string[] memory contents,
        string[] memory imageHashes,
        uint256[] memory timestamps,
        uint256[] memory likeCounts
    ) {
        uint256 activePostCount = 0;
        
        // Count active posts
        for (uint256 i = 0; i < postIds.length; i++) {
            if (!posts[postIds[i]].isDeleted) {
                activePostCount++;
            }
        }

        uint256 returnCount = _count > activePostCount ? activePostCount : _count;
        
        ids = new uint256[](returnCount);
        contents = new string[](returnCount);
        imageHashes = new string[](returnCount);
        timestamps = new uint256[](returnCount);
        likeCounts = new uint256[](returnCount);

        uint256 currentIndex = 0;
        // Start from the latest posts (reverse order)
        for (uint256 i = postIds.length; i > 0 && currentIndex < returnCount; i--) {
            uint256 postId = postIds[i - 1];
            if (!posts[postId].isDeleted) {
                Post storage post = posts[postId];
                ids[currentIndex] = post.id;
                contents[currentIndex] = post.content;
                imageHashes[currentIndex] = post.imageHash;
                timestamps[currentIndex] = post.timestamp;
                likeCounts[currentIndex] = post.likes;
                currentIndex++;
            }
        }
    }
}