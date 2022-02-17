// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

// NFT contract to inherit from.
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";

// Helper functions OpenZeppelin provides.
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/utils/Strings.sol";

import "hardhat/console.sol";


contract Bongo is ERC721 {
  // We'll hold our character's attributes in a struct. Feel free to add
  // whatever you'd like as an attribute! (ex. defense, crit chance, etc).
  struct BongoAttributes {
    uint BongoIndex;
    string name;
    string imageURI;
  }
  // A lil array to help us hold the default data for our characters.
  // This will be helpful when we mint new characters and need to know
  // things like their HP, AD, etc.

  using Counters for Counters.Counter;
  Counters.Counter private _tokenIds;

  CharacterAttributes[] defaultBongos;

  mapping(uint256 => CharacterAttributes) public nftHolderAttributes;//tokenId->characterAttributes
  mapping(address => uint256) public nftHolders;// address -> tokenId

  event BongoNFTMinted(address sender, uint256 tokenId, uint256 characterIndex);


  constructor(
    string[] memory bongoNames,
    string[] memory bongoImageURIs
  ) ERC721("Bongos", "Bongo")
  {
    // Loop through all the characters, and save their values in our contract so
    // we can use them later when we mint our NFTs.
    for(uint i = 0; i < bongoNames.length; i += 1) {
      defaultCharacters.push(BongoAttributes({
        characterIndex: i,
        name: characterNames[i],
        imageURI: characterImageURIs[i]
      }));
    }
    _tokenIds.increment();
  }

   function mintBongoNFT(uint _bongoIndex) external {

       uint256 newItemId = _tokenIds.current();
       _safeMint(msg.sender, newItemId);

       nftHolderAttributes[newItemId] = BongoAttributes(
           {
            characterIndex: _characterIndex,
            name: defaultBongos[_characterIndex].name,
            imageURI: defaultBongos[_characterIndex].imageURI
           }
       );

       nftHolders[msg.sender] = newItemId;
       _tokenIds.increment();
       emit BongoNFTMinted(msg.sender, newItemId, _characterIndex);
   }

  function checkIfUserHasNFT() public view returns (BongoAttributes memory) {
    // Get the tokenId of the user's character NFT
    uint256 userNftTokenId = nftHolders[msg.sender];
    // If the user has a tokenId in the map, return their character.
    if (userNftTokenId > 0) {
      return nftHolderAttributes[userNftTokenId];
    }
    // Else, return an empty character.
    else {
      BongoAttributes memory emptyStruct;
      return emptyStruct;
    }
  }

  function getAllDefaultCharacters() public view returns (CharacterAttributes[] memory) {
    return defaultBongos;
  }
}