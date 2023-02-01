// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;


import "erc721a/contracts/ERC721A.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract CyCertTokenA is ERC721A,AccessControl {
    using Counters for Counters.Counter;


    bytes32 public constant MINTER_ROLE = keccak256("MINTER_ROLE");
    bytes32 public constant BURNER_ROLE = keccak256("BURNER_ROLE");
    Counters.Counter private _tokenIdCounter;
    mapping(uint256 => string) private _tokenURIs;



    constructor() ERC721A("CyCertTokenA", "CCT") {
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _grantRole(BURNER_ROLE, msg.sender);
        _grantRole(MINTER_ROLE, msg.sender);
    }

    function safeMint(address to, string memory uri,uint256 quantity) public onlyRole(MINTER_ROLE) {
        uint256 tokenId = _tokenIdCounter.current();
        _tokenIdCounter.increment();
        _safeMint(to, quantity);
        _tokenURIs[tokenId] = uri;
    }

    // The following functions are overrides required by Solidity.

    function _burn(uint256 tokenId) internal override(ERC721A) onlyRole(BURNER_ROLE){
        super._burn(tokenId);
    }




    function transferFrom(
        address from,
        address to,
        uint256 tokenId
    ) public virtual payable override {

    }

    function safeTransferFrom(
        address from,
        address to,
        uint256 tokenId
    ) public virtual payable override {

    }

    function safeTransferFrom(
        address from,
        address to,
        uint256 tokenId,
        bytes memory data
    ) public virtual payable override {

    }
    function approve(address to, uint256 tokenId) public virtual payable override {
    }

    function getApproved(uint256 tokenId) public view virtual override returns (address) {
    }


    function setApprovalForAll(address operator, bool approved) public virtual override {
    }

    function isApprovedForAll(address owner, address operator) public view virtual override returns (bool) {
    }

    function _beforeTokenTransfers(
        address from,
        address to,
        uint256, /* firstTokenId */
        uint256 batchSize
    ) internal virtual override{

    }

    function _requireMinted(uint256 tokenId) internal view virtual {
        require(_exists(tokenId), "ERC721A: invalid token ID");
    }

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

    function supportsInterface(bytes4 interfaceId)
    public
    view
    override(ERC721A,AccessControl)
    returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }
}