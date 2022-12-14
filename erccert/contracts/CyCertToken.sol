// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;


import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Burnable.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract CyCertToken is ERC721,ERC721URIStorage, ERC721Enumerable, AccessControl, ERC721Burnable {
    using Counters for Counters.Counter;


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
    }

    // The following functions are overrides required by Solidity.

    function _burn(uint256 tokenId) internal override(ERC721, ERC721URIStorage) onlyRole(BURNER_ROLE){
        super._burn(tokenId);
    }

    function burn(uint256 tokenId) public virtual override(ERC721Burnable) onlyRole(BURNER_ROLE){
        //solhint-disable-next-line max-line-length
        // require(_isApprovedOrOwner(_msgSender(), tokenId), "ERC721: caller is not token owner or approved");
        _burn(tokenId);
    }



    function transferFrom(
        address from,
        address to,
        uint256 tokenId
    ) public virtual override {

    }


    function safeTransferFrom(
        address from,
        address to,
        uint256 tokenId
    ) public virtual override {

    }


    function safeTransferFrom(
        address from,
        address to,
        uint256 tokenId,
        bytes memory data
    ) public virtual override {

    }

    function approve(address to, uint256 tokenId) public virtual override {

    }

    function getApproved(uint256 tokenId) public view virtual override returns (address) {

    }


    function setApprovalForAll(address operator, bool approved) public virtual override {

    }

    function isApprovedForAll(address owner, address operator) public view virtual override returns (bool) {
        return false;
    }
    function _beforeTokenTransfer(
        address from,
        address to,
        uint256, /* firstTokenId */
        uint256 batchSize
    ) internal virtual override(ERC721, ERC721Enumerable){

        }


    function tokenURI(uint256 tokenId)
    public
    view
    override(ERC721, ERC721URIStorage)
    returns (string memory)
    {
        return super.tokenURI(tokenId);
    }

    function supportsInterface(bytes4 interfaceId)
    public
    view
    override(ERC721, AccessControl,ERC721Enumerable)
    returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }
}