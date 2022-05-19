const { SHA256 } = require("crypto-js");
const { writeFileSync, readFileSync } = require("fs");
class Block {
    constructor(blockId, timestamp, data, prevHash) {
        this.blockId = blockId;
        this.timestamp = timestamp;
        this.prevHash = prevHash;
        this.data = JSON.stringify(data);
        this.dataHash = SHA256(this.data).toString();
        this.nonce = 0;
        this.hash = this.calculateHash();
    }
    calculateHash() {
        return SHA256(
            [
                this.blockId,
                this.timestamp,
                this.prevHash,
                this.data,
                this.dataHash,
                this.nonce,
            ].join("@-#_$")
        ).toString();
    }
    mineBlock(key = 2) {
        while (this.hash.substring(0, key) !== Array(key + 1).join("0")) {
            this.nonce++;
            this.hash = this.calculateHash();
        }
        console.log(
            "[+] Block Mined -> BlockId:",
            this.blockId + "\tNonce:",
            this.nonce
        );
        return {
            blockId: this.blockId,
            timestamp: this.timestamp,
            prevHash: this.prevHash,
            data: JSON.parse(this.data),
            hash: this.hash,
        };
    }
    verifyBlock(key = 2) {
        while (this.hash.substring(0, key) !== Array(key + 1).join("0")) {
            this.nonce++;
            this.hash = this.calculateHash();
        }
        return this.hash;
    }
}

class BlockChain {
    constructor(difficulty = 1) {
        this.difficulty = difficulty;
        this.chain = [this.genesisBlock()];
        this.blockId = 0;
    }
    genesisBlock() {
        let block = new Block(0, "01/01/2022 00:00:00", {}, "0");
        return block.mineBlock(this.difficulty);
    }
    getLatestBlockHash() {
        if (this.blockId === 0) return "0";
        return this.chain[this.blockId - 1].hash;
    }
    genTimeStamp() {
        let date = new Date();
        return [
            [date.getDate() + 1, date.getMonth() + 1, date.getFullYear()].join(
                "/"
            ),
            [
                date.getHours(),
                date.getMinutes(),
                date.getSeconds(),
                date.getMilliseconds(),
            ].join(":"),
        ].join(" ");
    }
    addBlock(data) {
        this.blockId++;
        let block = new Block(
            this.blockId,
            this.genTimeStamp(),
            data,
            this.getLatestBlockHash()
        );
        this.chain.push(block.mineBlock(this.difficulty));
        return this.chain[this.blockId];
    }
    setDifficulty(difficulty) {
        this.difficulty = difficulty;
        this.chain = [this.genesisBlock()];
        this.blockId = 0;
    }
    /** Additional Function */
    importBlocks(fileName) {
        this.chain = this.chain.concat(
            JSON.parse(readFileSync(fileName + ".txt", "utf-8"))
        );
        if (this.verifyChain()) {
            console.log(
                "[+] Data Imported. Total Number of Blocks:",
                this.chain.length
            );
        } else {
            this.chain = [this.genesisBlock()];
            console.log("[-] Chain is compromised");
        }
    }
    exportBlocks(fileName) {
        writeFileSync(fileName + ".txt", JSON.stringify(this.chain.slice(1)));
    }
    /** Verification Function */
    verifyChain() {
        let blockId = 1;
        while (blockId < this.blockId) {
            if (this.chain[blockId].prevHash !== this.chain[blockId].hash) {
                return false;
            }
            blockId++;
        }
        return true;
    }
    verifyBlock(blockId) {
        if (blockId < this.blockId) {
            let block = new Block(
                blockId,
                this.chain[blockId].timestamp,
                this.chain[blockId].data,
                this.chain[blockId].prevHash
            );
            if (
                block.verifyBlock(this.difficulty) ===
                this.chain[blockId + 1].prevHash
            )
                return true;
            else return false;
        } else {
            console.log("[-] Unable to verify latest block");
            return false;
        }
    }
}

module.exports = new BlockChain();

// const bc = new BlockChain(4);
// bc.importBlocks("data");
// bc.addBlock({ name: "Malay", age: 21 });
// bc.addBlock({ name: "Sally", age: 20 });
// bc.addBlock({ name: "John", age: 23 });
// bc.exportBlocks("data");
// console.log(bc.chain);
