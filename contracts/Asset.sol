// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "./Mintable.sol";

contract Asset is ERC721, Mintable {

    string baseUri = "";

    constructor(
        address _owner,
        string memory _name,
        string memory _symbol,
        string memory _baseUri,
        address _imx
    ) ERC721(_name, _symbol) Mintable(_owner, _imx) {
        baseUri = _baseUri;
    }

    function _mintFor(
        address user,
        uint256 id,
        bytes memory
    ) internal override {
        _safeMint(user, id);
    }

    function _baseURI() override internal view virtual returns (string memory) {
        return baseUri;
    }
}
