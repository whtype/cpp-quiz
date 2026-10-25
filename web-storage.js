/* Browser adapter for the same storage API used by the mini-program. */
var webMemory = {}, webStorageFailed = false
var wx = {
  getStorageSync:function(key){
    try { var value=localStorage.getItem('web_'+key);return value?JSON.parse(value):undefined }
    catch(e){webStorageFailed=true;return webMemory[key]}
  },
  setStorageSync:function(key,value){
    webMemory[key]=value
    try{localStorage.setItem('web_'+key,JSON.stringify(value))}catch(e){webStorageFailed=true}
  },
  removeStorageSync:function(key){
    delete webMemory[key]
    try{localStorage.removeItem('web_'+key)}catch(e){webStorageFailed=true}
  }
}
