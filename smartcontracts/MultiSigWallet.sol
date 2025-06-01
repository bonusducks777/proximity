// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

contract MultiSigWallet {
    // Events
    event Deposit(address indexed sender, uint256 amount, uint256 balance);
    event SubmitTransaction(
        address indexed owner,
        uint256 indexed txIndex,
        address indexed to,
        uint256 value,
        bytes data
    );
    event ConfirmTransaction(address indexed owner, uint256 indexed txIndex);
    event RevokeConfirmation(address indexed owner, uint256 indexed txIndex);
    event ExecuteTransaction(address indexed owner, uint256 indexed txIndex);
    event ControllerConnected(address indexed controller);
    event ControllerDisconnected(address indexed controller);

    // State variables
    address[] public controllers;
    mapping(address => bool) public isController;
    mapping(address => bool) public isConnected;
    uint256 public numConfirmationsRequired;
    bool public controllersSet;
    
    struct Transaction {
        address to;
        uint256 value;
        bytes data;
        bool executed;
        uint256 numConfirmations;
    }

    // mapping from tx index => owner => bool
    mapping(uint256 => mapping(address => bool)) public isConfirmed;
    Transaction[] public transactions;

    modifier onlyController() {
        require(isController[msg.sender], "Not a controller");
        _;
    }

    modifier allControllersConnected() {
        require(areAllControllersConnected(), "Not all controllers are connected");
        _;
    }

    modifier txExists(uint256 _txIndex) {
        require(_txIndex < transactions.length, "Transaction does not exist");
        _;
    }

    modifier notExecuted(uint256 _txIndex) {
        require(!transactions[_txIndex].executed, "Transaction already executed");
        _;
    }

    modifier notConfirmed(uint256 _txIndex) {
        require(!isConfirmed[_txIndex][msg.sender], "Transaction already confirmed");
        _;
    }

    constructor(address[] memory _controllers, uint256 _numConfirmationsRequired) {
        require(_controllers.length > 0, "Controllers required");
        require(
            _numConfirmationsRequired > 0 &&
                _numConfirmationsRequired <= _controllers.length,
            "Invalid number of required confirmations"
        );

        for (uint256 i = 0; i < _controllers.length; i++) {
            address controller = _controllers[i];

            require(controller != address(0), "Invalid controller");
            require(!isController[controller], "Controller not unique");

            isController[controller] = true;
            controllers.push(controller);
        }

        numConfirmationsRequired = _numConfirmationsRequired;
        controllersSet = true;
    }

    receive() external payable {
        emit Deposit(msg.sender, msg.value, address(this).balance);
    }

    // Controller connection functions
    function connectController() external onlyController {
        require(!isConnected[msg.sender], "Controller already connected");
        isConnected[msg.sender] = true;
        emit ControllerConnected(msg.sender);
    }

    function disconnectController() external onlyController {
        require(isConnected[msg.sender], "Controller not connected");
        isConnected[msg.sender] = false;
        emit ControllerDisconnected(msg.sender);
    }

    function areAllControllersConnected() public view returns (bool) {
        for (uint256 i = 0; i < controllers.length; i++) {
            if (!isConnected[controllers[i]]) {
                return false;
            }
        }
        return true;
    }

    // Transaction functions
    function submitTransaction(
        address _to,
        uint256 _value,
        bytes memory _data
    ) public onlyController allControllersConnected {
        uint256 txIndex = transactions.length;

        transactions.push(
            Transaction({
                to: _to,
                value: _value,
                data: _data,
                executed: false,
                numConfirmations: 0
            })
        );

        emit SubmitTransaction(msg.sender, txIndex, _to, _value, _data);
    }

    function confirmTransaction(uint256 _txIndex)
        public
        onlyController
        allControllersConnected
        txExists(_txIndex)
        notExecuted(_txIndex)
        notConfirmed(_txIndex)
    {
        Transaction storage transaction = transactions[_txIndex];
        transaction.numConfirmations += 1;
        isConfirmed[_txIndex][msg.sender] = true;

        emit ConfirmTransaction(msg.sender, _txIndex);
    }

    function executeTransaction(uint256 _txIndex)
        public
        onlyController
        allControllersConnected
        txExists(_txIndex)
        notExecuted(_txIndex)
    {
        Transaction storage transaction = transactions[_txIndex];

        require(
            transaction.numConfirmations >= numConfirmationsRequired,
            "Cannot execute transaction"
        );

        transaction.executed = true;

        (bool success, ) = transaction.to.call{value: transaction.value}(
            transaction.data
        );
        require(success, "Transaction failed");

        emit ExecuteTransaction(msg.sender, _txIndex);
    }

    function revokeConfirmation(uint256 _txIndex)
        public
        onlyController
        txExists(_txIndex)
        notExecuted(_txIndex)
    {
        Transaction storage transaction = transactions[_txIndex];

        require(isConfirmed[_txIndex][msg.sender], "Transaction not confirmed");

        transaction.numConfirmations -= 1;
        isConfirmed[_txIndex][msg.sender] = false;

        emit RevokeConfirmation(msg.sender, _txIndex);
    }

    // View functions
    function getControllers() public view returns (address[] memory) {
        return controllers;
    }

    function getTransactionCount() public view returns (uint256) {
        return transactions.length;
    }

    function getTransaction(uint256 _txIndex)
        public
        view
        returns (
            address to,
            uint256 value,
            bytes memory data,
            bool executed,
            uint256 numConfirmations
        )
    {
        Transaction storage transaction = transactions[_txIndex];

        return (
            transaction.to,
            transaction.value,
            transaction.data,
            transaction.executed,
            transaction.numConfirmations
        );
    }

    function getControllerConnectionStatus() public view returns (address[] memory, bool[] memory) {
        bool[] memory connectionStatus = new bool[](controllers.length);
        
        for (uint256 i = 0; i < controllers.length; i++) {
            connectionStatus[i] = isConnected[controllers[i]];
        }
        
        return (controllers, connectionStatus);
    }

    function getContractBalance() public view returns (uint256) {
        return address(this).balance;
    }
}