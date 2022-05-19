# Leo-Blockchain

### Easy & Simple implementation of blockchian

Hello World here is my blockchain implementation which you can use anywhere without more effort weather t be a simple wallet project or a transaction project. I have made use of Crypto Library of NodeJS to generate "SHA256" for the blocks.

```jsx
// Import the module
const blockchain = require("leo-blockchain");
```

<br/>

Following are the functionality provided by the module.

(1) Add a new Block to the chain

```jsx
blockchain.addBlock(data); // datatype of "data" ---> JSON
```

<br/>

(2) Set difficulty in Proof of work algorithm while mining
[!Warning] It leads to creating a new chain. Loss of data may occour.

```jsx
blockchain.setDifficulty(difficulty); // difficulty belongs to range of 1 to 10
```

<br/>

(3) Verify a random block with the given Id.

```jsx
blockchain.verifyBlock(blockId); // returns boolean
```

<br/>

(4) Verify entire chain.

```jsx
blockchain.verifyChain(); // returns boolean
```

<br/>

(5) Import Data.
[!Warning] Import data only when the chain is empty or it wont accept forcing to reset.

```jsx
blockchain.importBlocks(fileName); // fileName without extension.
```

<br/>

(6) Export Data.

```jsx
blockchain.exportBlocks(fileName); // fileName without extension.
```
