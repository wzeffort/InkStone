// 管理当前文件
import api from "./api.js";
import EventBus from "@/eventBus";
import Dexie from "dexie";

class Fs {

  constructor() {
    if (Fs.instance) {
      return Fs.instance;
    }

    this.api = api;
    this.db = new Dexie("FileDB");

    this.db.version(2).stores({
      files: "path, content, original_sha"
    });

    Fs.instance = this;
  }

  isExist = async (path) => {
    // 文件是否存在
    const count = await this.db.files.where({ path }).count();
    return count > 0;
  };

  write = async (path, content='') => {
    /**
     * 写入文件
     */
    let file = {
      path,
      content,
    };
    await this.db.files.put(file);
    return true;
  }

  get = async (path) => {
    /**
     * 获取文件内容
     */
    if (!this.isExist(path)) {
      return null;
    }
    let file = await this.db.files.get(path);
    return file.content;
  }

  delete = async (path) => {
    // 删除文件
    if (!this.isExist(path)) {
      return false;
    }
    await this.db.files.delete(path);
    return true;
  };

  list = async () => {
    // 获取所有文件
    let files = await this.db.files.toArray();
    if (!files){
      return [];
    }
    console.log(files, files.map((file) => file.path));
    return files.map((file) => file.path);
  };
}

const instance = new Fs();
// Object.freeze(instance);

export default instance;
