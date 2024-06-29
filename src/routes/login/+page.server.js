import { redirect } from "@sveltejs/kit";
import { get_user_info_from_cookies } from "$lib/server/AuthenticationManager.js";


export const load = async({locals, cookies, parent, url})=>{
  if(locals.is_authenticated && locals.user_info){
    // console.log('get_user_info_from_cookies(cookies) : ', await get_user_info_from_cookies(cookies));
    throw redirect(302, '/')
  }

  // let franchise_unique_id = get_franchise_unique_id_from_url(url);

  // let franchise_manager = await get_franchise_manager_instance();

  // console.log('franchise_unique_id', franchise_unique_id);
  // let franchise_info = franchise_manager.get_franchise_info(franchise_unique_id);
  // if(!franchise_info){
  //   await franchise_manager.get_franchise_infos_from_erp(false);
  //   franchise_info = franchise_manager.get_franchise_info(franchise_unique_id);
  //   await franchise_info?.download_franchise_files();
  // }

  return {
    // franchise_info: franchise_info?.get_public_info()
  }

}



