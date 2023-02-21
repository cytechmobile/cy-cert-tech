// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721Receiver.sol";
import "@openzeppelin/contracts/utils/Strings.sol";

contract CyCertTokenB{
    struct RoleData {
        mapping(address => bool) members;
        bytes32 adminRole;
    }


    mapping(bytes32 => RoleData) private _roles;
    uint8 private constant _ADDRESS_LENGTH = 20;
    bytes32 public constant DEFAULT_ADMIN_ROLE = 0x00;
    // Token name
    string private _name;

    // Token symbol
    string private _symbol;

    // Mapping from token ID to owner address
    mapping(uint256 => address) private _owners;

    // Mapping owner address to token count
    mapping(address => uint256) private _balances;



    // Optional mapping for token URIs
    using Counters for Counters.Counter;
    using Strings for uint256;
    mapping(uint256 => string) private _tokenURIs;
    mapping (address => uint256[]) private _tokensMinted;


    bytes32 public constant MINTER_ROLE = keccak256("MINTER_ROLE");
    bytes32 public constant BURNER_ROLE = keccak256("BURNER_ROLE");

    Counters.Counter private _tokenIdCounter;

    constructor() {
        _name = "CyCertToken";
        _symbol = "CCT";
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _grantRole(BURNER_ROLE, msg.sender);
        _grantRole(MINTER_ROLE, msg.sender);
    }



    /*****************************/
    /* ERC721 BASE FUNCTIONALITY */
    /*****************************/

    function safeMint(address to, string memory uri) public onlyRole(MINTER_ROLE) {
        uint256 tokenId = _tokenIdCounter.current();
        _tokenIdCounter.increment();
        _safeMint(to, tokenId);
        _setTokenURI(tokenId, uri);
        // Add the token ID to the recipient's list of tokens
        _tokensMinted[to].push(tokenId);
    }

    function getTokensMinted(address recipient) public view returns (uint256[] memory) {
        return _tokensMinted[recipient];
    }


    function tokenURI(uint256 tokenId) public view virtual returns (string memory) {
        _requireMinted(tokenId);

        string memory _tokenURI = _tokenURIs[tokenId];
        string memory base = _baseURI();

        // If there is no base URI, return the token URI.
        if (bytes(base).length == 0) {
            return _tokenURI;
        }
        // If both are set, concatenate the baseURI and tokenURI (via abi.encodePacked).
        if (bytes(_tokenURI).length > 0) {
            return string(abi.encodePacked(base, _tokenURI));
        }

        return tokenURI(tokenId);
    }


    function _setTokenURI(uint256 tokenId, string memory _tokenURI) internal virtual {
        require(_exists(tokenId), "URIStorage: URI set of nonexistent token");
        _tokenURIs[tokenId] = _tokenURI;
    }


    function burn(address recipient, uint256 tokenId) public virtual onlyRole(BURNER_ROLE){
        uint256[] storage tokens = _tokensMinted[recipient];
        uint256 tokenIndex = tokens.length;

        for (uint256 i = 0; i < tokens.length; i++) {
            if (tokens[i] == tokenId) {
                tokenIndex = i;
                break;
            }
        }
        // If the token ID is not found, revert the transaction
        require(tokenIndex < tokens.length, "Token not found");
        // Delete the token ID from the recipient's list of tokens
        if (tokenIndex < tokens.length - 1) {
            tokens[tokenIndex] = tokens[tokens.length - 1];
        }
        tokens.pop();
        _burn(tokenId);
    }

    function _burn(uint256 tokenId) internal virtual {
        address owner = ownerOf(tokenId);

        // Update ownership in case tokenId was transferred by `_beforeTokenTransfer` hook
        owner = ownerOf(tokenId);


    unchecked {
        // Cannot overflow, as that would require more tokens to be burned/transferred
        // out than the owner initially received through minting and transferring in.
        _balances[owner] -= 1;
    }
        delete _owners[tokenId];

        emit Transfer(owner, address(0), tokenId);


        if (bytes(_tokenURIs[tokenId]).length != 0) {
            delete _tokenURIs[tokenId];
        }
    }



    function balanceOf(address owner) public view virtual returns (uint256) {
        require(owner != address(0), "CyCertToken: address zero is not a valid owner");
        return _balances[owner];
    }

    function ownerOf(uint256 tokenId) public view virtual returns (address) {
        address owner = _ownerOf(tokenId);
        require(owner != address(0), "CyCertToken: invalid token ID");
        return owner;
    }

    function name() public view virtual returns (string memory) {
        return _name;
    }

    function symbol() public view virtual returns (string memory) {
        return _symbol;
    }


    function _baseURI() internal view virtual returns (string memory) {
        return "";
    }

    function _ownerOf(uint256 tokenId) internal view virtual returns (address) {
        return _owners[tokenId];
    }

    function _exists(uint256 tokenId) internal view virtual returns (bool) {
        return _ownerOf(tokenId) != address(0);
    }

    function _safeMint(address to, uint256 tokenId) internal virtual {
        _safeMint(to, tokenId, "");
    }


    function _safeMint(
        address to,
        uint256 tokenId,
        bytes memory data
    ) internal virtual {
        _mint(to, tokenId);
        require(
            _checkOnERC721Received(address(0), to, tokenId, data),
            "ERC721: transfer to non ERC721Receiver implementer"
        );
    }
    function _checkOnERC721Received(
        address from,
        address to,
        uint256 tokenId,
        bytes memory data
    ) private returns (bool) {
        if (isContract(to)) {
            try IERC721Receiver(to).onERC721Received(_msgSender(), from, tokenId, data) returns (bytes4 retval) {
                return retval == IERC721Receiver.onERC721Received.selector;
            } catch (bytes memory reason) {
                if (reason.length == 0) {
                    revert("ERC721: transfer to non ERC721Receiver implementer");
                } else {
                    /// @solidity memory-safe-assembly
                    assembly {
                        revert(add(32, reason), mload(reason))
                    }
                }
            }
        } else {
            return true;
        }
    }


    function _mint(address to, uint256 tokenId) internal virtual {
        require(to != address(0), "ERC721: mint to the zero address");
        require(!_exists(tokenId), "ERC721: token already minted");

        require(!_exists(tokenId), "ERC721: token already minted");

    unchecked {
        // Will not overflow unless all 2**256 token ids are minted to the same owner.
        // Given that tokens are minted one by one, it is impossible in practice that
        // this ever happens. Might change if we allow batch minting.
        // The ERC fails to describe this case.
        _balances[to] += 1;
    }

        _owners[tokenId] = to;

        emit Transfer(address(0), to, tokenId);


    }

    function isContract(address account) internal view returns (bool) {
        // This method relies on extcodesize/address.code.length, which returns 0
        // for contracts in construction, since the code is only stored at the end
        // of the constructor execution.

        return account.code.length > 0;
    }

    function _requireMinted(uint256 tokenId) internal view virtual {
        require(_exists(tokenId), "CyCertToken: invalid token ID");
    }


    function _msgSender() internal view virtual returns (address) {
        return msg.sender;
    }


    /**********************/
    /* ROLE FUNCTIONALITY */
    /**********************/

    function getRoleAdmin(bytes32 role) public view virtual returns (bytes32) {
        return _roles[role].adminRole;
    }


    function grantRole(bytes32 role, address account) public virtual onlyRole(getRoleAdmin(role)) {
        _grantRole(role, account);
    }

    function revokeRole(bytes32 role, address account) public virtual onlyRole(getRoleAdmin(role)) {
        _revokeRole(role, account);
    }

    function _grantRole(bytes32 role, address account) internal virtual {
        if (!hasRole(role, account)) {
            _roles[role].members[account] = true;
            emit RoleGranted(role, account, _msgSender());
        }
    }

    function _revokeRole(bytes32 role, address account) internal virtual {
        if (hasRole(role, account)) {
            _roles[role].members[account] = false;
            emit RoleRevoked(role, account, _msgSender());
        }
    }

    function _checkRole(bytes32 role, address account) internal view virtual {
        if (!hasRole(role, account)) {
            revert(
            string(
                abi.encodePacked(
                    "AccessControl: account ",
                    Strings.toHexString(account),
                    " is missing role ",
                    Strings.toHexString(uint256(role), 32)
                )
            )
            );
        }
    }

    function hasRole(bytes32 role, address account) public view virtual returns (bool) {
        return _roles[role].members[account];
    }


    function _checkRole(bytes32 role) internal view virtual {
        _checkRole(role, _msgSender());
    }



    modifier onlyRole(bytes32 role) {
        _checkRole(role);
        _;
    }



    event RoleGranted(bytes32 indexed role, address indexed account, address indexed sender);
    event RoleRevoked(bytes32 indexed role, address indexed account, address indexed sender);
    event Transfer(address indexed from, address indexed to, uint256 indexed tokenId);

}