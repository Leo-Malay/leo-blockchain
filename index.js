const { SHA256 } = require("crypto-js");
const { writeFileSync, readFileSync } = require("fs");

class Transaction {
    constructor(blockId, transactionId, datetime, data, prevHash) {
        this.blockId = blockId;
        this.transactionId = transactionId;
        this.datetime = datetime;
        this.data = data;
        this.prevHash = prevHash;
        this.hash = this.calcHash();
    }
    calcHash() {
        return SHA256(
            JSON.stringify({
                blockId: this.blockId,
                transactionId: this.transactionId,
                datetime: this.datetime,
                data: this.data,
                prevHash: this.prevHash,
            })
        ).toString();
    }
    toJSON() {
        return {
            transactionId: this.transactionId,
            datetime: this.datetime,
            data: this.data,
            prevHash: this.prevHash,
            hash: this.hash,
        };
    }
}
class Block {
    constructor(blockId, prevHash, difficulty) {
        this.block = [];
        this.blockId = blockId;
        this.transactionId = this.blockId * 8;
        this.transactionCount = 0;
        this.nonce = 0;
        this.prevTransactionHash = undefined;
        this.difficulty = difficulty;
        this.prevHash = prevHash;
        this.datetime = undefined;
        this.foundationHash = undefined;
        this.hash = undefined;
    }
    addTransaction(datetime, data, prevHash) {
        if (this.transactionCount < 8) {
            let t = new Transaction(
                this.blockId,
                this.transactionId + this.transactionCount,
                datetime,
                data,
                prevHash
            );
            this.prevTransactionHash = t.hash;
            this.block.push(t.toJSON());
            this.transactionCount++;
            return { success: true, transactionId: t.transactionId };
        } else return { success: false, transactionId: undefined };
    }
    calcFoundationHash() {
        function hash(hdata) {
            if (hdata.length === 0) return;
            if (hdata.length === 1) return hdata[0];
            let temp = [];
            for (let i = 0; i < hdata.length / 2; i += 2)
                temp.push(SHA256(hdata[i] + hdata[i + 1]).toString());
            return hash(temp);
        }
        let dataHash = [];
        for (let a = 0; a < this.transactionCount; a++)
            dataHash.push(SHA256(JSON.stringify(this.block[a])).toString());

        return hash(dataHash);
    }
    calculateHash() {
        return SHA256(
            JSON.stringify({
                blockId: this.blockId,
                data: this.block,
                foundationHash: this.foundationHash,
                datetime: this.datetime,
                difficulty: this.difficulty,
                prevHash: this.prevHash,
                hash: this.hash,
            })
        ).toString();
    }
    mineBlock(datetime) {
        if (this.transactionCount !== 8) return { success: false };
        this.datetime = datetime;
        this.foundationHash = this.calcFoundationHash();
        this.hash = this.calculateHash();
        while (
            this.hash.substring(0, this.difficulty) !==
            Array(this.difficulty + 1).join("0")
        ) {
            this.nonce++;
            this.hash = this.calculateHash();
        }
        return { success: true };
    }
    toJSON() {
        return {
            blockId: this.blockId,
            data: this.block,
            foundationHash: this.foundationHash,
            datetime: this.datetime,
            difficulty: this.difficulty,
            prevHash: this.prevHash,
            hash: this.hash,
            nonce: this.nonce,
        };
    }
}
class Blockchain {
    constructor() {
        this.difficulty = 3;
        this.prevTransactionHash = undefined;
        this.prevBlockHash = undefined;
        this.chain = this.genesisBlock();
        this.blockId = 0;
        this.blockHold = new Block(this.blockId, "0", this.difficulty);
    }
    genesisBlock() {
        let temp = new Block(-1, "0", this.difficulty);
        for (let i = 0; i < 8; i++) {
            temp.addTransaction(
                "01/01/2022 00:00:00:000",
                {},
                this.prevTransactionHash
            );
            this.prevTransactionHash = temp.prevTransactionHash;
        }
        temp.mineBlock("01/01/2022 00:00:00:000");
        temp = temp.toJSON();
        this.prevBlockHash = temp.hash;
        return [temp];
    }
    addTransaction(data, datetimestamp = undefined) {
        /**
         * @param {data} JSON Pass JSON data to be stored
         *
         * @returns {success: Boolean, transactionId: Number};
         */
        function genTimeStamp() {
            let date = new Date();
            return [
                [
                    date.getDate() + 1,
                    date.getMonth() + 1,
                    date.getFullYear(),
                ].join("/"),
                [
                    date.getHours(),
                    date.getMinutes(),
                    date.getSeconds(),
                    date.getMilliseconds(),
                ].join(":"),
            ].join(" ");
        }
        datetimestamp =
            datetimestamp !== undefined ? datetimestamp : genTimeStamp();
        let t = this.blockHold.addTransaction(
            datetimestamp,
            data,
            this.prevTransactionHash
        );
        if (t.success === true) {
            this.prevTransactionHash = this.blockHold.prevTransactionHash;
            return { success: true, transactionId: t.transactionId };
        } else {
            this.blockHold.mineBlock(datetimestamp);
            this.blockHold = this.blockHold.toJSON();
            this.prevBlockHash = this.blockHold.hash;
            this.chain.push(this.blockHold);
            this.blockId++;
            this.blockHold = new Block(
                this.blockId,
                this.prevBlockHash,
                this.difficulty
            );
            this.blockHold.addTransaction(
                datetimestamp,
                data,
                this.prevTransactionHash
            );
            this.prevTransactionHash = this.blockHold.prevTransactionHash;
            return { success: true, transactionId: t.transactionId };
        }
    }
    searchTransaction(transactionId) {
        /**
         * @param {transactionId} Number Unique transactionId recieved while adding transaction
         *
         * @return {success: Boolean, data: Object}
         */
        let blockId = Math.floor(transactionId / 8);
        let transactionCountId = transactionId % 8;
        try {
            return {
                success: true,
                data: this.chain[blockId + 1].data[transactionCountId],
            };
        } catch {
            console.log("[ERROR]: Please check your transaction number!");
            return { success: false, data: null };
        }
    }
    exportBlocks(fileName) {
        /**
         * @param {fileName} String Filename with extension
         *
         * @return {success: Boolean}
         */
        writeFileSync(
            fileName,
            JSON.stringify({
                chain: this.chain.slice(1),
                unminedBlock: this.blockHold.toJSON(),
            })
        );
        return { success: true };
    }
    importBlocks(fileName) {
        /**
         * @param {fileName} String Filename with extension
         *
         * @return {success: Boolean}
         */
        try {
            let data = JSON.parse(readFileSync(fileName, "utf-8"));
            for (let i = 0; i < data.chain.length; i++) {
                for (let j = 0; j < data.chain[i].data.length; j++)
                    this.addTransaction(
                        data.chain[i].data[j].data,
                        data.chain[i].data[j].datetime
                    );
            }
            for (let k = 0; k < data.unminedBlock.data.length; k++)
                this.addTransaction(
                    data.unminedBlock.data[k].data,
                    data.unminedBlock.data[k].datetime
                );
            return { success: true };
        } catch {
            console.error("[ERROR]: No such file found!");
            return { success: false };
        }
    }
    setDifficulty(difficulty) {
        /**
         * @param {difficulty} Number Set difficulty
         */
        this.difficulty = difficulty;
    }
}

module.exports = new Blockchain();
