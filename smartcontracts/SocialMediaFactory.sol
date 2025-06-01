// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "./SocialMediaProfile.sol";

contract SocialMediaFactory {
    // Events
    event ProfileCreated(address indexed user, address indexed profileContract, uint256 timestamp);
    event ProfileDeactivated(address indexed user, uint256 timestamp);

    // State variables
    mapping(address => address) public userProfiles;
    mapping(address => bool) public hasProfile;
    address[] public allProfiles;
    
    struct UserInfo {
        address profileContract;
        uint256 createdAt;
        bool isActive;
    }
    
    mapping(address => UserInfo) public userInfo;

    // Modifiers
    modifier hasNoProfile() {
        require(!hasProfile[msg.sender], "User already has a profile");
        _;
    }

    modifier hasExistingProfile() {
        require(hasProfile[msg.sender], "User does not have a profile");
        _;
    }

    // Functions
    function createProfile(
        string memory _username,
        string memory _bio,
        string memory _profileImageHash
    ) external hasNoProfile returns (address) {
        // Deploy new SocialMediaProfile contract
        SocialMediaProfile newProfile = new SocialMediaProfile(
            _username,
            _bio,
            _profileImageHash
        );

        address profileAddress = address(newProfile);
        
        // Update mappings
        userProfiles[msg.sender] = profileAddress;
        hasProfile[msg.sender] = true;
        allProfiles.push(profileAddress);
        
        userInfo[msg.sender] = UserInfo({
            profileContract: profileAddress,
            createdAt: block.timestamp,
            isActive: true
        });

        emit ProfileCreated(msg.sender, profileAddress, block.timestamp);
        return profileAddress;
    }

    function deactivateProfile() external hasExistingProfile {
        userInfo[msg.sender].isActive = false;
        emit ProfileDeactivated(msg.sender, block.timestamp);
    }

    function reactivateProfile() external hasExistingProfile {
        userInfo[msg.sender].isActive = true;
    }

    // View functions
    function getUserProfile(address _user) external view returns (address) {
        return userProfiles[_user];
    }

    function getAllProfiles() external view returns (address[] memory) {
        return allProfiles;
    }

    function getActiveProfiles() external view returns (address[] memory) {
        uint256 activeCount = 0;
        
        // Count active profiles
        for (uint256 i = 0; i < allProfiles.length; i++) {
            address profileOwner = getProfileOwner(allProfiles[i]);
            if (userInfo[profileOwner].isActive) {
                activeCount++;
            }
        }

        address[] memory activeProfiles = new address[](activeCount);
        uint256 currentIndex = 0;
        
        // Populate active profiles array
        for (uint256 i = 0; i < allProfiles.length; i++) {
            address profileOwner = getProfileOwner(allProfiles[i]);
            if (userInfo[profileOwner].isActive) {
                activeProfiles[currentIndex] = allProfiles[i];
                currentIndex++;
            }
        }

        return activeProfiles;
    }

    function getTotalProfileCount() external view returns (uint256) {
        return allProfiles.length;
    }

    function getActiveProfileCount() external view returns (uint256) {
        uint256 activeCount = 0;
        for (uint256 i = 0; i < allProfiles.length; i++) {
            address profileOwner = getProfileOwner(allProfiles[i]);
            if (userInfo[profileOwner].isActive) {
                activeCount++;
            }
        }
        return activeCount;
    }

    function getUserInfo(address _user) external view returns (
        address profileContract,
        uint256 createdAt,
        bool isActive,
        bool hasProfileBool
    ) {
        UserInfo memory info = userInfo[_user];
        return (
            info.profileContract,
            info.createdAt,
            info.isActive,
            hasProfile[_user]
        );
    }

    // Helper function to get profile owner
    function getProfileOwner(address _profileContract) internal view returns (address) {
        SocialMediaProfile profile = SocialMediaProfile(_profileContract);
        return profile.owner();
    }

    // Function to check if a username is taken (optional feature)
    function isUsernameTaken(string memory _username) external view returns (bool) {
        for (uint256 i = 0; i < allProfiles.length; i++) {
            SocialMediaProfile profile = SocialMediaProfile(allProfiles[i]);
            (string memory username,,,,,,,) = profile.getProfile();
            if (keccak256(abi.encodePacked(username)) == keccak256(abi.encodePacked(_username))) {
                return true;
            }
        }
        return false;
    }
}