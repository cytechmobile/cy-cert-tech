// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;


import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract CyCertTokenB is ERC721, AccessControl {

    //Variables
    using Counters for Counters.Counter;
    using Strings for uint256;

    // Optional mapping for token URIs
    mapping(uint256 => string) private _tokenURIs;
    mapping (address => uint256[]) private _tokensMinted;


    bytes32 public constant MINTER_ROLE = keccak256("MINTER_ROLE");
    bytes32 public constant BURNER_ROLE = keccak256("BURNER_ROLE");

    Counters.Counter private _tokenIdCounter;

    constructor() ERC721("CyCertToken", "CCT") {
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _grantRole(BURNER_ROLE, msg.sender);
        _grantRole(MINTER_ROLE, msg.sender);
    }


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

    /**
     * @dev See {IERC721Metadata-tokenURI}.
     */
    function tokenURI(uint256 tokenId) public view virtual override returns (string memory) {
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

        return super.tokenURI(tokenId);
    }

    /**
     * @dev Sets `_tokenURI` as the tokenURI of `tokenId`.
     *
     * Requirements:
     *
     * - `tokenId` must exist.
     */
    function _setTokenURI(uint256 tokenId, string memory _tokenURI) internal virtual {
        require(_exists(tokenId), "ERC721URIStorage: URI set of nonexistent token");
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

    /**
     * @dev See {ERC721-_burn}. This override additionally checks to see if a
     * token-specific URI was set for the token, and if so, it deletes the token URI from
     * the storage mapping.
     */
    function _burn(uint256 tokenId) internal virtual override {
        super._burn(tokenId);

        if (bytes(_tokenURIs[tokenId]).length != 0) {
            delete _tokenURIs[tokenId];
        }
    }



    function transferFrom(
        address from,
        address to,
        uint256 tokenId
    ) public virtual override(ERC721) {

    }


    function safeTransferFrom(
        address from,
        address to,
        uint256 tokenId
    ) public virtual override(ERC721) {

    }


    function safeTransferFrom(
        address from,
        address to,
        uint256 tokenId,
        bytes memory data
    ) public virtual override(ERC721) {

    }

    function approve(address to, uint256 tokenId) public virtual override(ERC721) {

    }

    function getApproved(uint256 tokenId) public view virtual override(ERC721) returns (address) {

    }


    function setApprovalForAll(address operator, bool approved) public virtual override(ERC721) {

    }

    function isApprovedForAll(address owner, address operator) public view virtual override(ERC721) returns (bool) {

    }

    function _beforeTokenTransfer(
        address from,
        address to,
        uint256, /* firstTokenId */
        uint256 batchSize
    ) internal virtual override(ERC721){

    }



    function supportsInterface(bytes4 interfaceId)
    public
    view
    override(ERC721, AccessControl)
    returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }
}