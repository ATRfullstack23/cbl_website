
import {ERP} from "./ERP.js"


ERP.prototype.get_module_random = function () {
    let modules_obj = this.modules;
    let modules_arr = Object.values(modules_obj)
    return modules_arr;
}

ERP.prototype.get_module_from_id = function (id) {
    return this.allModules[id];
}

ERP.get_instance = function () {
    return window.erp;
}

export const temp = {ERP_V2 :ERP}

// export {temp}