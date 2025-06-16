export class Resources {
  private static resourceCache: { [url: string]: any } = {};
  private static readyCallbacks: (() => void)[] = [];

  static load(urls: string | string[]): void {
    if (Array.isArray(urls)) {
      urls.forEach((url) => this._load(url));
    } else {
      this._load(urls);
    }
  }

  private static _load(url: string): void {
    if (this.resourceCache[url]) {
      return;
    }

    const img = new Image();
    img.onload = () => {
      this.resourceCache[url] = img;

      if (this.isReady()) {
        this.readyCallbacks.forEach((func) => func());
      }
    };

    this.resourceCache[url] = false;
    img.src = url;
  }

  static get(url: string): any {
    const resource = this.resourceCache[url];
    return resource === false ? undefined : resource;
  }

  static isReady(): boolean {
    for (const key in this.resourceCache) {
      if (
        Object.prototype.hasOwnProperty.call(this.resourceCache, key) &&
        this.resourceCache[key] === false
      ) {
        return false;
      }
    }
    return true;
  }

  static onReady(callback: () => void): void {
    this.readyCallbacks.push(callback);
  }
}