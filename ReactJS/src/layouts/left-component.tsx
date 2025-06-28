import { useEffect, useState } from "react";
import { Menu, PanelMenu, Tooltip } from "../assets/css/prime-library";
import { NavLink } from "react-router-dom";
import $ from "jquery";
const loadChildMenus = () => {
  if (localStorage["data_usermoduleList"]) {
    let mainMenu: any = JSON.parse(localStorage["data_usermoduleList"]);
    let menuData = {
      usermoduleList: JSON.parse(localStorage["data_usermoduleList"]),
      userscreenmapList: JSON.parse(localStorage["data_userscreenmapList"]),
    };
    if (mainMenu.length > 0) {
      mainMenu.forEach((menu) => {
        let menulist: any = menuData.userscreenmapList.filter(
          (f) => f.parentid == menu.parentid
        );

        menu.childMenu = [];
        let childMenu = [];
        menulist.forEach((menu) => {
          let menuitem: any = {
            label: menu.childscreenname,
            url: menu.childscreenurl,
            tooltip: menu.childscreenname,
            template: (item, options) => {
              return (
                <NavLink
                  className="p-menuitem-link"
                  to={menu.childscreenurl}
                  activeClassName="select"
                >
                  {menu.childscreenname}
                </NavLink>
              );
            },
          };
          let childMenus = menuData.userscreenmapList.filter(
            (f) => f.parentid == menu.childscreenid
          );
          if (childMenus.length) menuitem.items = [];
          childMenus.forEach((child) => {
            let childitem: any = {
              label: child.childscreenname,
              url: child.childscreenurl,
              tooltip: child.childscreenname,
              template: (item, options) => {
                return (
                  <NavLink
                    className="p-menuitem-link"
                    to={child.childscreenurl}
                    activeClassName="select"
                  >
                    {child.childscreenname}
                  </NavLink>
                );
              },
            };
            menuitem.items.push(childitem);
          });
          childMenu.push(menuitem);
        });
        menu.childMenu = childMenu;
      });
    }
    return mainMenu;
  }
};

const LeftOption = (menuLink) => {
  return <Menu model={menuLink.childMenu} />;
};
const LeftComponent = () => {
  const [sideMenu, setSidemenu] = useState(false);
  const [prev, setPrev] = useState("");
  const [activeMenu, setActivemenu] = useState("");
  const [menuList, setMenuList] = useState([]);
  
  const [reloadTimer, setReloadTimer] = useState<NodeJS.Timeout>();

  useEffect(() => {
    setMenuList(loadChildMenus())
  }, [])

  // useEffect(() => {
  //   reloadWatcher();
  // }, []);

  // const reloadWatcher = () => {

  //   if (!reloadTimer) {

  //     setReloadTimer(
  //       setInterval(() => {
  //         let isReload = localStorage["toReload"] == "true";
  //         if (isReload) {
  //           loadChildMenus();
  //           window.location.reload()
  //           localStorage["toReload"] = "false";
  //         }
  //       }, 5000)
  //     );
  //   }
  // };
  $(document).on("click", function (event) {
    //console.log($(event.target).closest(".apps-left").length)
    var aa = $(event.target).closest(".apps-left").length;
    if (aa == 0) {
      setSidemenu(false);
      setPrev("");
    }
    console.log(aa);
    // if ($(event.target).closest(".apps-left").length==0) {
    //       $(".apps-center").animate({ left: -500 }, 0);
    //     }
  });
  const parentmenuclick = (menuLink) => {
    prev == menuLink.parentscreenname ? setSidemenu(false) : setSidemenu(true);
    //sideMenu? setSidemenu(false): setSidemenu(true)
    setPrev(menuLink.parentscreenname == prev ? "" : menuLink.parentscreenname);
    setActivemenu(menuLink.rel_link);
    
 
    setMenuList((prevMenu) =>
      prevMenu.map((item) => ({
        ...item,
        isActive: item.rel_link === menuLink.rel_link,
      }))
    );
  };

  return (
    <div>
      <div className="apps-left bg-shadow">
        <div className="sidebar overflow-y">
          <div className="menu-tabs" rel="main-menu">
            <Tooltip target=".menu-tabs a" />
            {menuList &&
              menuList.map((menuLink) => (
                <a
                className={`${menuLink.isActive ? "select" : null}`}
                  key={menuLink.parentid}
                  rel={menuLink.rel_link}
                  data-pr-tooltip={menuLink.parentscreenname}
                  data-pr-position="right"
                  onClick={() => parentmenuclick(menuLink)}
                >
                  <i className={menuLink.menu_icon}></i>
                </a>
              ))}
          </div>
        </div>
      </div>
      <div
        className="apps-center bg-shadow select"
        style={{ left: sideMenu ? 60 : -500 }}
      >
        <div className="main-menu scroll-y">
          {menuList &&
            menuList.map((menuLink, index) => (
              <div
                key={menuLink.parentid}
                className={`menu-tabs-container ${menuLink.rel_link} ${
                  menuLink.isActive ? "select": ""
                }`}
              >
                <h5>{menuLink.parentscreenname}</h5>
                <PanelMenu className="left-menu" model={menuLink.childMenu} />
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};

export default LeftComponent;
