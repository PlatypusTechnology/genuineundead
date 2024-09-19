// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/Pausable.sol";
import "@openzeppelin/contracts/token/ERC1155/extensions/ERC1155Burnable.sol";
import "@openzeppelin/contracts/token/ERC1155/extensions/ERC1155Supply.sol";

/**
 * @title Genuine Undeade Stories
 * @author Gui (qruz) Rodrigues | Nighshift
 * @notice Custom ERC1155 contract for Genuine Undead comic dApp. Each token represents a page
 *         that can be minted to enable token gated content on the dApp reader.
 */
contract GenuineUndeadStories is
    ERC1155,
    Ownable,
    Pausable,
    ERC1155Burnable,
    ERC1155Supply
{
    uint256 public mintPrice = 0.01 ether;

    mapping(uint256 => uint256) public _supplyCaps;
    mapping(uint256 => string) private _tokenURIs;

    constructor(address _newOwner, string memory _uri) ERC1155(_uri) {
        _transferOwnership(_newOwner);
    }

    function setMintPrice(uint256 newPrice) external onlyOwner {
        mintPrice = newPrice;
    }

    function releaseTokenId(
        uint256 tokenId,
        uint256 maxSupply
    ) external onlyOwner {
        require(totalSupply(tokenId) <= maxSupply, "INVALID_SUPPLY");
        _supplyCaps[tokenId] = maxSupply;
    }

    function setTokenURI(
        uint256 _tokenId,
        string memory _uri
    ) external onlyOwner {
        _tokenURIs[_tokenId] = _uri;
    }

    function uri(uint256 tokenId) public view override returns (string memory) {
        if (bytes(_tokenURIs[tokenId]).length > 0) {
            return _tokenURIs[tokenId];
        }
        return super.uri(tokenId);
    }

    function setURI(string memory newuri) public onlyOwner {
        _setURI(newuri);
    }

    function pause() public onlyOwner {
        _pause();
    }

    function unpause() public onlyOwner {
        _unpause();
    }

    function withdraw() external onlyOwner {
        uint256 balance = address(this).balance;
        require(balance > 0, "NO_FUNDS");
        payable(owner()).transfer(balance);
    }

    function mint(
        uint256 tokenId,
        uint256 amount
    ) external payable whenNotPaused {
        require(mintPrice * amount == msg.value, "INCORRECT_VALUE");
        require(_supplyCaps[tokenId] > 0, "UNRELEASED_TOKEN");
        require(
            _supplyCaps[tokenId] > totalSupply(tokenId) + amount,
            "SUPPLY_REACHED"
        );

        _mint(msg.sender, tokenId, amount, "");
    }

    function ownerMintBatch(
        address to,
        uint256[] memory ids,
        uint256[] memory amounts,
        bytes memory data
    ) public onlyOwner {
        _mintBatch(to, ids, amounts, data);
    }

    function _beforeTokenTransfer(
        address operator,
        address from,
        address to,
        uint256[] memory ids,
        uint256[] memory amounts,
        bytes memory data
    ) internal override(ERC1155, ERC1155Supply) whenNotPaused {
        super._beforeTokenTransfer(operator, from, to, ids, amounts, data);
    }
}
