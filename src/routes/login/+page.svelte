
<svelte:head>
<!--    <link rel="icon" href="{website_platform_logo_square}" />-->
    <title>{platform_display_name + ' - creators portal'}</title>
</svelte:head>

<script>
    import {createEventDispatcher, onMount, tick} from "svelte";
    import LoadingOverlay from "$lib/ui_elements/LoadingOverlay.svelte";
    import viewport from "../../lib/useViewportAction.js";
    import { env } from "$env/dynamic/public"; // import area

    const dispatch = createEventDispatcher();
    let platform_display_name = env.PUBLIC_ERP_DISPLAY_NAME || 'Mbme Pay';
    let platform_caption = env.PUBLIC_WEBSITE_PLATFORM_CAPTION || 'Custom Erp Solution';


    const erp_root_url = env.PUBLIC_ERP_ROOT_URL;

    export let data;


    export let appDescriptionHtml = '';
    export let appDisplayName = '';
    export let onUserAuthenticationSuccessful = function(user_info) {
        // redirect(307, '/app');
        location.href = '/app';
    };
    export let onUserAlreadyLoggedIn;
    let shallFadeIn = false;

    onMount(async () => {
        try{
            // let userInfo = await userApi.getUserLoggedInUserInfo();
            // onUserAlreadyLoggedIn(userInfo);
        }
        catch (e) {
        }
        shallShowLoadingOverlay = false;
        shallFadeIn = true;
        console.log(data);
    });

    let username = '', password = '', shallShowLoadingOverlay = true, errorMessage = '', welcomeMessage = '';

    function handleLoginButtonClick(evt) {
        evt.preventDefault();
        if(!username || !password){
            return;
        }
        shallShowLoadingOverlay = true;
        const login_api_url =  erp_root_url + '/login';

        jQuery.ajax({
            url: login_api_url,
            type: 'POST',
            data: {
                userName: username,
                password : password
            }
        }).done(function(data){
            shallShowLoadingOverlay = false;
            console.log('data', data);
            if(data.success){
                localStorage.user_login_result = JSON.stringify(data.user);
                location.href = '/app';
            }
            else{
                errorMessage = data.errorMessage;
                setTimeout(()=>{
                    errorMessage = '';
                }, 3000);
                // alert('wrong username or password', data);
            }
        });

    }

let is_lcontent_in_viewport = false;

</script>


<div id="loginContainer" class="login-container" class:fadeIn={shallFadeIn}>
    <div class="full-gradient-overlay">

        <LoadingOverlay isFixed="true" shallShowLoadingOverlay="{shallShowLoadingOverlay}"/>

        <section>
            <div class="overlay">
            </div>

            <div class="leftcontent" class:is_lcontent_in_viewport use:viewport on:enter_viewport={()=>{is_lcontent_in_viewport = true;}}>
                <span class="ltitle" id="appDisplayName">{appDisplayName}</span>
                <br>
                <span class="lcontent" id="appDescription"> {@html appDescriptionHtml}</span>
                <br>

            </div>



            <div class="sidebar">
                <span id="loginStatusMessage" class="rtitle">Login</span>
                <br>
                <br>
                <form id="loginForm" on:submit={handleLoginButtonClick}>
                    <input id="txtUsername" bind:value={username} autocomplete="off" required="" class="textinput" type="text" name="username" placeholder="Username">
                    <br>
                    <br>
                    <input id="txtPassword" bind:value={password} required="" class="textinput" type="password" name="password" placeholder="Password">
                    <br>
                    <br>
                    <br>
                    <br>
                    <button type="submit" id="btnDoLogin" on:click={handleLoginButtonClick} class="submit">
                        <span>Login</span>
                    </button>

                    <br>
                    <br>

                    <div id="divErrorMessage">{errorMessage}</div>

                    <br>
                    <br>
                    <br>

                    <div id="divInlineMessage">{welcomeMessage}</div>


                </form>


<!--                <div class="bottom_area">-->
<!--                    {#if franchise_logo_landscape}-->
<!--                        <div class="franchise_landscape_logo">-->
<!--                            <img src="{franchise_logo_landscape}">-->
<!--                        </div>-->
<!--                    {/if}-->
<!--                </div>-->


<!--                <a class="rayCloudSolutionsLink" href="http://www.raycloudsolutions.com">-->
<!--                    <img class="rayCloudSolutionsLogo" src="images/rayCloudSolutions.png">-->
<!--                </a>-->

            </div>



        </section>



    </div>
</div>






<style>


    .franchise_info_basic{
        position: fixed;
        left: 10px;
        bottom: 50px;
    }

    .bottom_area{
        position: absolute;
        bottom: 10px;
        right: 0px;
        padding: 5px;
        z-index: 999;
    }

    .franchise_display_name {
        color: #CCC;
        font-size: 2rem;
        font-weight: 200;
        padding-left: 30px;
    }

    .franchise_caption {
        color: #CCC;
        font-size: 1.5rem;
        font-weight: 200;
        padding-left: 30px;
    }




    .franchise_landscape_logo img{
        /*border-radius: 50%;*/
        width: 80%;
        max-height: 30px;
    }

    #loginContainer *{
        box-sizing: border-box;
    }

    .login-container{
        background-image: url(/images/bg_login.jpg);
        overflow-x: hidden;
        overflow-y: hidden;
        background-size: cover;
        position: fixed;
        left: 0;
        right: 0;
        bottom: 0;
        top: 0;
        z-index: 999;
        font-family: Segoe UI;
        text-align: left;
    }


    #loginContainer .sidebar{
        position: fixed;
        transition: opacity 300ms ease;
        opacity: 0.50;
        background-color: #fff;
        position: fixed;
        top: 0;
        right: 0;
        z-index: 100;
        padding-top: 60px;

        width: 400px;
        height: 500px;
        inset: 0;
        left: calc(50vw - 200px);
        top: calc(50vh - 250px);
        border: 1px solid #AAA;
        border-radius: 10px;
    }

    #loginContainer .overlay {
        transition: opacity 300ms ease;
        z-index: 1;
        opacity: 0.65;
        background-color: #000;
        height: 100%;
        width: 100%;
        position: fixed;
        top: 0;
        left: 0;
    }


    .leftcontent {
        z-index: 2;
        height: calc(100% - 120px);
        width: calc(100% - 470px);
        margin-top: 60px;
        margin-left: 60px;
        position: fixed;
        top: 0;
        left: 0;
        opacity: 0;
        transition: all 500ms ease;
    }

    #loginContainer .ltitle {
        color: #fff;
        font-size: 36px;
        font-weight: 200;
        margin-bottom: 0px;
        display: block;
    }

    .leftcontent.is_lcontent_in_viewport{
        opacity: 1;
    }

    .left_image_logo{
        border-radius: 50%;
        padding: 50px;
        background: white;
        /*padding-top: 250px;*/
        width: 30vh;
        height: 30vh;
    }
    .left_image_logo img{
        border-radius: 50%;
        width: 100%;
    }

    #loginContainer .lcontent {
        color: #fff;
        font-size: 18px;
        font-weight: 300;
        line-height: 1.25;
    }

    #loginContainer #loginForm {
        transform: translateX(10px);
        transition: transform 300ms ease;
    }

    #loginContainer.fadeIn #loginForm {
        transform: translateX(0px);
    }

    #loginContainer.fadeIn .sidebar {
        opacity: 1;
    }

    #loginContainer .rtitle {
        color: #333;
        font-size: 36px;
        font-weight: 200;
        padding-left: 30px;
    }

    #loginContainer .textinput {
        margin-left: 35px;
        height: 40px !important;
        border-width: 0;
        border-style: solid;
        border-color: #666;
        border-left-width: 5px;
        background-color: #eee;
        width: 270px;
        padding-left: 10px !important;
        outline: 0;
    }

    #loginContainer .textinput:focus {
        background-color: #f4f4f4;
        box-shadow: none;
        border-width: 0;
        border-color: #666;
        border-left-width: 5px;
    }

    #loginContainer select {
        margin-left: 35px;
        height: 40px !important;
        border-width: 0;
        border-style: solid;
        border-color: #666;
        border-left-width: 5px;
        background-color: #eee;
        width: 270px;
        padding-left: 10px !important;
        outline: 0;
    }

    #loginContainer .submit .negative{
        background-color: #df121a;
    }
    #loginContainer .submit[disabled]{
        opacity: .5;
        cursor: none;
    }
    #loginContainer .submit {
        background-color: #1e90ff;
        height: 38px;
        width: 100px;
        font-size: 16px;
        border-style: solid;
        border-width: 0;
        border-radius: 2px;
        /* position: fixed; */
        /* bottom: 30px; */
        /* right: 30px; */
        color: #fff;
        outline: 0;
        cursor: pointer;
        margin-right: 31px;
        float: right;
        text-transform: none;
    }


    #loginContainer #divErrorMessage{
        color: red;
        font-size: 12px;
        margin: 40px;
    }



    #loginContainer #divInlineMessage{
        color: black;
        opacity: 1;
        font-size: 14px;
        margin: 5px;
        padding: 5px;
        transition: all 100ms ease;
        display: block;
        text-align: center;
        text-transform: uppercase;
    }




    #loginContainer.loading .sidebar:after {
        content: '';
        background: #ffffff4f;
        position: absolute;
        right: 0;
        width: 350px;
        height: 100%;
        top: 0;
    }

    #loginContainer.loading .submit {
        opacity: 0.85;
        pointer-events: none;
    }



    #loginContainer .rayCloudSolutionsLink {
        display: block;
        position: absolute;
        bottom: 10px;
        margin-left: auto;
        margin-right: auto;
        left: 0;
        width: 100%;
        padding-right: 25px;
        text-align: right;
    }

    #loginContainer .rayCloudSolutionsLink img{
        height: 40px;
    }





    #loginContainer ul#userListPopup {
        position: absolute;
        min-width: 200px;
        background: white;
        border: 1px solid #AAA;
        left: -210px;
        top: 0px;
    }


    #loginContainer ul#userListPopup li {
        display: block;
        padding: 3px;
        border-bottom: 1px solid #EEE;
        cursor: pointer;
    }

    #loginContainer ul#userListPopup li img {
        width: 30px;
        height: 30px;
        vertical-align: top;
    }

    #loginContainer ul#userListPopup li span {
        display: inline-block;
        vertical-align: top;
        line-height: 30px;
        font-size: 20px;
        padding-left: 10px;
    }




    body.mobile #loginContainer .sidebar{
        width: 94vw;
    }

    body.mobile #loginContainer .leftcontent{
        position: relative;
        /* bottom: 75px; */
        right: 10px;
        top: 40px;
        left: 20px;
        z-index: 101;
        /* top: auto; */
        width: auto;
        width: 85vw;
        height: auto;
        opacity: 1;
        color: black;
        margin-left: 0;
        margin-top: 0;
    }

    /*body.mobile #loginContainer.onScreenKeyboardShowing .leftcontent, */
    body.mobile #loginContainer.onScreenKeyboardShowing .rayCloudSolutionsLink{
        display: none;
    }


    body.mobile #loginContainer #appDisplayName {
        color: black;
        font-size: 24px;
    }

    body.mobile #loginContainer #appDescription {
        color: black;
        font-size: 14px;
    }























    /*Login Screen*/

    .login-form{
        -webkit-transform: rotate(-75deg) scale(.3,.3);
        opacity: .1;
        position: relative;
        margin: 0 auto;
        margin-top: 10%;
        padding: 20px 20px 20px;
        width: 310px;
        background: white;
        border-radius: 3px;
        -webkit-box-shadow: 0 0 200px rgba(255, 255, 255, 0.5), 0 1px 2px rgba(0, 0, 0, 0.3);
        box-shadow: 0 0 200px rgba(255, 255, 255, 0.5), 0 1px 2px rgba(0, 0, 0, 0.3);
    }

    .login-form h1{
        margin: -20px -20px 21px;
        line-height: 40px;
        font-size: 15px;
        font-weight: bold;
        color: #555;
        text-align: center;
        text-shadow: 0 1px white;
        background: #f3f3f3;
        cursor: move;
        border-bottom: 1px solid #cfcfcf;
        border-radius: 3px 3px 0 0;
        background-image: -webkit-linear-gradient(top, whiteffd, #eef2f5);
        background-image: -moz-linear-gradient(top, whiteffd, #eef2f5);
        background-image: -o-linear-gradient(top, whiteffd, #eef2f5);
        background-image: linear-gradient(to bottom, whiteffd, #eef2f5);
        -webkit-box-shadow: 0 1px whitesmoke;
        box-shadow: 0 1px whitesmoke;
    }

    .login-form input[type="text"],
    .login-form input[type="password"]{
        margin: 5px;
        padding: 0 10px;
        width: 200px;
        height: 34px;
        color: #404040;
        background: white;
        border: 1px solid;
        border-color: #c4c4c4 #d1d1d1 #d4d4d4;
        border-radius: 2px;
        outline: 5px solid #eff4f7;
        -moz-outline-radius: 3px;
        -webkit-box-shadow: inset 0 1px 3px rgba(0, 0, 0, 0.12);
        box-shadow: inset 0 1px 3px rgba(0, 0, 0, 0.12);
    }

    .login-form input[type="text"]:focus,
    .login-form input[type="password"]:focus{
        border-color: #7dc9e2;
        outline-color: #dceefc;
        outline-offset: 0;
    }

    .login-form select{
        margin: 5px;
        width: 220px;
        height: 34px;
        color: #404040;
        background: white;
        border: 1px solid;
        border-color: #c4c4c4 #d1d1d1 #d4d4d4;
        border-radius: 2px;
        outline: 5px solid #eff4f7;
        -moz-outline-radius: 3px;
        -webkit-box-shadow: inset 0 1px 3px rgba(0, 0, 0, 0.12);
        box-shadow: inset 0 1px 3px rgba(0, 0, 0, 0.12);
    }
    .login-form select:focus{
        border-color: #7dc9e2;
        outline-color: #dceefc;
        outline-offset: 0;
    }

    .login-form p{
        margin: 20px 0 0;
    }
    .login-form .login-button-panel{
        text-align: center;
    }

    .login-form .login-button-panel button{
        padding: 0 18px;
        height: 29px;
        font-size: 12px;
        font-weight: bold;
        color: #527881;
        text-shadow: 0 1px #e3f1f1;
        background: #cde5ef;
        border: 1px solid;
        border-color: #b4ccce #b3c0c8 #9eb9c2;
        border-radius: 2px;
        outline: 0;
        cursor: pointer;
        -webkit-box-sizing: content-box;
        -moz-box-sizing: content-box;
        box-sizing: content-box;
        background-image: -webkit-linear-gradient(top, #edf5f8, #cde5ef);
        background-image: -moz-linear-gradient(top, #edf5f8, #cde5ef);
        background-image: -o-linear-gradient(top, #edf5f8, #cde5ef);
        background-image: linear-gradient(to bottom, #edf5f8, #cde5ef);
        -webkit-box-shadow: inset 0 1px white, 0 1px 2px rgba(0, 0, 0, 0.15);
        box-shadow: inset 0 1px white, 0 1px 2px rgba(0, 0, 0, 0.15);
    }

    .login-form .login-button-panel button:active{
        background: #cde5ef;
        border-color: #9eb9c2 #b3c0c8 #b4ccce;
        -webkit-box-shadow: inset 0 0 3px rgba(0, 0, 0, 0.2);
        box-shadow: inset 0 0 3px rgba(0, 0, 0, 0.2);
    }

    .login-form .login-button-panel button[disabled]{
        opacity: .4;
        cursor: default;
        pointer-events: none;
    }




</style>