<script>
  export let data;
  let device_type = $page.data.device_type;
  import { page } from "$app/stores";
  import {
    NavBrand,
  } from "flowbite-svelte";

  import {
    HomeSolid,
    WalletSolid,
    AdjustmentsVerticalOutline,
    UserCircleSolid,

  } from "flowbite-svelte-icons";


  import { BottomNav, BottomNavItem } from "flowbite-svelte";

  async function update_theme(new_theme_name) {

    localStorage.setItem("theme_name", new_theme_name);


    theme_name = new_theme_name
    console.log("theme_name updated ", theme_name)

    location.reload()

    // const response = await fetch("/api/set_theme", {
    //   method: "POST",
    //   body: JSON.stringify({
    //     theme_name,
    //   }),
    //   headers: {
    //     "Content-Type": "application/json",
    //   },
    // });

    // let update_theme_response = await response.json();
    // console.log("update_theme_response", update_theme_response);
  }

  import { onMount } from "svelte";
  let is_mounted = false;

  async function loadIcon(item) {
    try {
      // Import the icon dynamically
      const iconModule = await import(
              `/node_modules/flowbite-svelte-icons/dist/${item.icon}.svelte`
              );

      // Extract the default export (the icon component)
      item.loadedIcon = iconModule.default;
      console.log("item", item.item_type, item);
    } catch (error) {
      console.error(`Error loading icon: ${error}`);
      return null;
    }
  }

  function handle_home_button_click() {
    window.erp.setDefaultModule();
  }

  function handle_logout_button_click() {
    window.erp.logOut(()=>{
      location.href = '/login';
    });
  }

  let dark_theme_color = {
    bg_color: "#262338",
    color: "#fff",
  };
  let white_theme_color = {
    bg_color: "#f1f1f1",
    color: "#333",
  };

  export let is_dark_theme = false;

  let theme_name = localStorage.getItem("theme_name") || "light_theme";

  if(theme_name == "dark_theme"){
    is_dark_theme = true;
  }else{
    is_dark_theme = false;
  }
  document.body.classList.add(theme_name)

  console.log("theme_name", theme_name, is_dark_theme);

  function toggle_dark_mode() {

    is_dark_theme = !is_dark_theme;

    console.log("toggling dark mode", is_dark_theme);

    if(is_dark_theme){
      update_theme("dark_theme")
    }else{
      update_theme("light_theme")
    }
  }
  onMount(async function () {
    is_mounted = true;
    window.globalElements.body.on('selected_main_navigation_display_name_change', (evt)=>{
      selected_main_navigation_display_name = main_navigation_selected_item_info?.display_name || '';
    });
  });
  let selected_main_navigation_display_name = '';
</script>

{#if is_mounted}
  <header
          class:pc={device_type !== "mobile"}
          class:mobile={device_type === "mobile"}
          class:dark_theme={theme_name == "dark_theme"}
          class:light_theme={theme_name == "light_theme"}
          class=""
  >

    <div class="selected_main_navigation_display_name">{selected_main_navigation_display_name}</div>

    <!--  -->
    <!--    <NavBrand href="/">-->
    <!--&lt;!&ndash;      <img&ndash;&gt;-->
    <!--&lt;!&ndash;        src="https://binarytechs.in/images/b2.png"&ndash;&gt;-->
    <!--&lt;!&ndash;        class="mr-3 h-6 sm:h-9"&ndash;&gt;-->
    <!--&lt;!&ndash;        alt=" Binary Technologies Logo"&ndash;&gt;-->
    <!--&lt;!&ndash;      />&ndash;&gt;-->
    <!--      <span-->
    <!--        class="self-center whitespace-nowrap text-xl font-semibold dark:text-white"-->
    <!--      >-->
    <!--        Mbme Pay-->
    <!--      </span>-->
    <!--    </NavBrand>-->
    <BottomNav
            position="relative"
            navType="border"
            class=" border-none"
            classOuter="w-fit border-0"
            classInner="grid-cols-4 text-grey border-0"
    >
      <BottomNavItem
              btnName="Home"
              on:click={handle_home_button_click}
              btnClass="text-white btn-hover border-0 border-x-0"
              btnSpan="text-gray-400"
      >
        <HomeSolid
                class="w-5 h-5 mb-1 text-gray-400 dark:text-gray-400 group-hover:text-gray-600 dark:group-hover:text-grey-500"
        />
      </BottomNavItem>
      <BottomNavItem
              btnName="Theme"
              on:click={toggle_dark_mode}
              btnClass="text-white btn-hover border-0 border-x-0"
              btnSpan="text-gray-400"
      >
        <WalletSolid
                class="w-5 h-5 mb-1 text-gray-400 dark:text-gray-400 group-hover:text-gray-600 dark:group-hover:text-grey-500"
        />
      </BottomNavItem>
      <BottomNavItem
              btnName="Settings"
              btnClass="text-white btn-hover border-0 border-x-0"
      >
        <AdjustmentsVerticalOutline
                class="w-5 h-5 mb-1 text-gray-400 dark:text-gray-400 group-hover:text-gray-600 dark:group-hover:text-grey-500"
        />
      </BottomNavItem>
      <BottomNavItem
              on:click={handle_logout_button_click}
              btnName="Logout"
              btnClass="text-white btn-hover border-0 border-x-0"
      >
        <UserCircleSolid
                class="w-5 h-5 mb-1 text-gray-400 dark:text-gray-400 group-hover:text-gray-600 dark:group-hover:text-grey-500"
        />
      </BottomNavItem>
    </BottomNav>
    <!-- <NavHamburger on:click={toggle} class="text-white"/>
      <NavUl {hidden}>
        <NavLi class="text-white" href="/" active={true}>Home</NavLi>
        <NavLi class="text-white" href="/about">About</NavLi>
        <NavLi class="text-white" href="/services">Services</NavLi>
        <NavLi class="text-white" href="/pricing">Pricing</NavLi>
        <NavLi class="text-white" href="/contact">Contact</NavLi>
      </NavUl> -->
  </header>

  <div
          class="pages"
  >
    <slot {is_dark_theme} />
  </div>

  <footer
          class:pc={device_type !== "mobile"}
          class:mobile={device_type === "mobile"}
          class=""
  >
    <!--    <span>copyrights <i class="fa-regular fa-copyright"></i> 2024</span>-->
    <span>Binary Technologies</span>
  </footer>
{/if}

<style>
  :global(
      header.dark_theme,
      .dark_theme :is(.selected_main_navigation_display_name, .grid)
    ) {
    background-color: var(--dark_theme_bg_color) !important;
    color: var(--dark_theme_color) !important;
  }
  :global(
      header.light_theme,
      .light_theme :is(.selected_main_navigation_display_name, .grid)
    ) {
    background-color: var(--white_theme_bg_color) !important;
    color: var(--white_theme_color) !important;
  }


  :global(button){
    border-radius: 4px;
  }
  :global(.dark_theme :is(div.main_navigation_container)) {
    background-color: var(--dark_theme_bg_color);
    color: var(--dark_theme_color);
  }
  :global(.light_theme :is(div.main_navigation_container)) {
    background-color: var(--white_theme_bg_color);
    color: var(--white_theme_color);
  }

  :global(:is(.dark_theme) :is(.formview-container, .erp_content__container) :is(button)) {
    /* background-color: #408dfb !important;
    border-color: #408dfb !important; */
    background-color: var(--dark_theme_bg_color);
    color: var(--dark_theme_color);
  }

  :global(:is(.light_theme) :is(.formview-container, .erp_content__container) :is(button)) {
    /* background-color: #408dfb !important;
    border-color: #408dfb !important; */
    background-color: var(--light_theme_btn_bg_color);
    color: #fff;
    background-image: none;
    padding: .5rem .6rem;
  }



  header {
    display: flex;
    flex-direction: row;
    justify-content: end;
    /*align-items: center;*/
    /* color: #fff; */
    font-size: 28px;
    text-transform: uppercase;
    /* background: white; */
    /*padding: 0 20px;*/
    padding-bottom: 6px;
  }
  header nav {
    background-color: transparent;
  }
  div {
    /* display: flex; */
  }
  div.pages {
    min-height: 85vh;
    display: flex;
    flex-grow: 1;
    flex-direction: row;
  }

  .cards-container :global(.card-items) {
    margin: 20px 0;
  }
  footer {
    display: flex;
    flex-direction: row;
    justify-content: end;
    align-items: center;
    /*padding: 30px 20%;*/
    /*padding-bottom: 30px;*/
    padding: 5px;
    color: #666;
  }
  footer span {
    text-transform: uppercase;
    margin: 0 10px;
  }
  footer.mobile {
    padding: 30px 4%;
  }

  .copy-right-container {
    background-color: #fff;
    color: #000;
    padding: 10px 0;
    text-align: center;
    justify-content: center;
    align-items: center;
  }
  .copy-right-container span {
    color: #f8b239;
    margin: 0 10px;
    display: flex;
  }


  header :global(.btn-hover) {
    border-color: #000;
    background: transparent;
  }
  header :global(.btn-hover:hover) {
    background: transparent;
    color: #000;
  }
  header :global(.btn-hover:hover :is(span, svg)) {
    color: #000;
  }

  .selected_main_navigation_display_name{
    color: black;
    position: absolute;
    left: calc(var(--main_navigation_width) + 35px);
    top: 14px;
  }
</style>
