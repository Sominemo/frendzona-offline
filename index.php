<?
function rDate($a) {
  //return '?'.filemtime('/home/admin/web/frendzona.info/public_html/offline/'.$a);
  return '';
}
?>
  <!DOCTYPE html>
  <html lang="ru">

  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <link rel="manifest" href="/manifest.webmanifest">
    <link rel="shortcut icon" href="//frendzona.info/design/img/favicon.ico">
    <meta name="theme-color" content="#34BFB0">
    <link rel="stylesheet" href="style.css<?=rDate('style.css')?>" async>
    <link rel="stylesheet" href="mobile.css<?=rDate('mobile.css')?>" async>
    <link rel="stylesheet" href="res/fonts/fonts.css<?=rDate('res/fonts/fonts.css')?>" async>
    <script src="debug.js<?=rDate('debug.js')?>"></script>
    <script src="common.js<?=rDate('common.js')?>"></script>
    <script src="engines.js<?=rDate('engines.js')?>"></script>
    <script src="connect.js<?=rDate('connect.js')?>"></script>
    <script src="ui_elements.js<?=rDate('ui_elements.js')?>"></script>
    <script src="events.js<?=rDate('events.js')?>"></script>
    <script src="auth.js<?=rDate('auth.js')?>"></script>
    <script src="settings.js<?=rDate('settings.js')?>"></script>
    <script src="linkThinker.js<?=rDate('linkThinker.js')?>"></script>
    <script src="ui.js<?=rDate('ui.js')?>"></script>
    <script src="dialogs.js<?=rDate('dialogs.js')?>"></script>
    <script src="language.js<?=rDate('language.js')?>"></script>
    <script src="friends.js<?=rDate('friends.js')?>"></script>
    <script src="im.js<?=rDate('im.js')?>"></script>
    <script src="profile.js<?=rDate('profile.js')?>"></script>
    <script src="player/player.js<?=rDate('player/player.js')?>"></script>
    <script src="report.js<?=rDate('report.js')?>"></script>
    <link rel="stylesheet" href="player/player.css<?=rDate('player/player.css')?>" disabled>
    <script src="offline.js<?=rDate('offline.js')?>"></script>
    <script src="updater.js<?=rDate('updater.js')?>"></script>
    <?
  if (isset($_GET['uwp']) && isset($_GET['titlebar-height']) && is_numeric($_GET['titlebar-height'])) {
    echo '<script>app.uwpBarHeight = '.$_GET['titlebar-height'].';</script>';
  }
    ?>
    <?=(isset($_GET['uwp']) && $_GET['uwp'] == 1 ? '<link rel="stylesheet" href="uwp.css'.rDate('uwp.css').'"><script src="uwp.js'.rDate('uwp.js').'"></script>' : '');?>
    <title>FrendZona</title>
  </head>

  <body>
    <div id="full-doc">
      <header id="header-content-block">

        <div id="main-header">
          <nav id="hamburger-content-block">
            <icon id="menu-hamburger">menu</icon>
          </nav>
          <div id="titler">
          <div id="head-text">FrendZona</div>
          <div id="sub-head-text"></div>
          </div>
          <nav id="add-nav-menu">
          </nav>
        </div>

        <nav id="additional-header">
        </nav>
      </header>
      <nav id="sidebar">
        <div id="sidebar-overflow-scroll">
          <div id="sidebar-header">
            <div id="sidebar-back-button-content-block">
              <icon id="sidebar-back-button">menu</icon>
            </div>
            <div id="sidebar-head-text">FrendZona</div>
            <div id="sidebar-head-user-info">
              <div id="sidebar-head-avatar"></div>
              <div class="sidebar-name-data">
                <div id="sidebar-head-user-name"></div>
                <div id="sidebar-head-user-status"></div>
              </div>
            </div>
          </div>
          <div id="sidebar-contents">
            <div class="sidebar-item" id="dialogs-sidebar" onclick="dialogs.open()">
              <icon>email</icon>
              <span id="sidebar-item-mail">Почта</span>
            </div>
            <div class="sidebar-item" id="friends-sidebar" onclick="friends.open()">
              <icon>people</icon>
              <span id="sidebar-item-friends">Друзья</span>
            </div>
            <div class="sidebar-item" onclick="settings.open()">
              <icon>settings</icon>
              <span id="sidebar-item-settings">Настройки</span>
            </div>
            <div class="sidebar-item" onclick="_.prototype.toggle();">
              <icon>translate</icon>
              <span id="sidebar-item-language">Сменить язык</span>
            </div>
            <div class="sidebar-item" onclick="auth.logout(1);">
              <icon>power_settings_new</icon>
              <span id="sidebar-item-logout">Выйти</span>
            </div>
          </div>
        </div>
      </nav>
      <div id="sidebar-layer"></div>
      <div id="popups"></div>
      <div id="wPage"></div>
      <main id="main">
        <div class="centration-div">
          <svg width="56px" height="56px" version="1" viewBox="0 0 28 28" xmlns="http://www.w3.org/2000/svg">
            <style type="text/css">
              .qp-circular-loader {
                width: 28px;
                height: 28px;
              }

              .qp-circular-loader-path {
                stroke-dasharray: 58.9;
                stroke-dashoffset: 58.9;
              }

              .qp-circular-loader,
              .qp-circular-loader * {
                -webkit-transform-origin: 50% 50%;
              }
              /* Rotating the whole thing */

              @-webkit-keyframes rotate {
                from {
                  -webkit-transform: rotate(0deg);
                }
                to {
                  -webkit-transform: rotate(360deg);
                }
              }

              .qp-circular-loader {
                -webkit-animation-name: rotate;
                -webkit-animation-duration: 1568.63ms;
                -webkit-animation-iteration-count: infinite;
                -webkit-animation-timing-function: linear;
              }
              /* Filling and unfilling the arc */

              @-webkit-keyframes fillunfill {
                from {
                  stroke-dashoffset: 58.8;
                }
                50% {
                  stroke-dashoffset: 0;
                }
                to {
                  stroke-dashoffset: -58.4;
                }
              }

              @-webkit-keyframes rot {
                from {
                  -webkit-transform: rotate(0deg);
                }
                to {
                  -webkit-transform: rotate(-360deg);
                }
              }

              @-webkit-keyframes colors {
                from {
                  stroke: #34BFB0;
                }
                to {
                  stroke: #34BFB0;
                }
              }

              .qp-circular-loader-path {
                -webkit-animation-name: fillunfill, rot, colors;
                -webkit-animation-duration: 1333ms, 5332ms, 5332ms;
                -webkit-animation-iteration-count: infinite, infinite, infinite;
                -webkit-animation-timing-function: cubic-bezier(0.4, 0.0, 0.2, 1), steps(4), linear;
                -webkit-animation-play-state: running, running, running;
                -webkit-animation-fill-mode: forwards;
              }
            </style>
            <g class="qp-circular-loader">
              <path class="qp-circular-loader-path" d="M 14,1.5 A 12.5,12.5 0 1 1 1.5,14" fill="none" stroke-linecap="square" stroke-width="3"
              />
            </g>
          </svg>
        </div>
      </main>
    </div>
    <div class="snackbar" id="snackbar">
      <table class="contents">
        <tr>
          <td class="text" id="snackbar-text"></td>
          <td class="close" id="snackbar-close">СКРЫТЬ</td>
      </table>
    </div>

    <div class="notification-box" id="notification-box">
      <table class="contents">
        <tr>
          <td class="text" id="notification-text"></td>
      </table>
    </div>
  </body>

  </html>