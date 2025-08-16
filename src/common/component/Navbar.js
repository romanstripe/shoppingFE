import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser } from "@fortawesome/free-regular-svg-icons";
import {
  faBars,
  faBox,
  faSort,
  faSearch,
  faShoppingBag,
} from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";
import { useSearchParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../../features/user/userSlice";

const Navbar = ({ user }) => {
  const [query] = useSearchParams();
  const dispatch = useDispatch();
  const { cartItemCount } = useSelector((state) => state.cart);
  const isMobile = window.navigator.userAgent.indexOf("Mobile") !== -1;
  const [showSearchBox, setShowSearchBox] = useState(false);
  const [sortDropdownOpen, setSortDropdownOpen] = useState(false);
  const [showSortOptions, setshowSortOptions] = useState(false);

  const menuList = [
    "여성",
    "Divided",
    "남성",
    "신생아/유아",
    "아동",
    "H&M HOME",
    "Sale",
    "지속가능성",
  ];
  let [width, setWidth] = useState(0);
  let navigate = useNavigate();

  const onCheckEnter = (event) => {
    if (event.key === "Enter") {
      if (event.target.value === "") {
        return navigate("/");
      }
      navigate(`?name=${event.target.value}`);
    }
  };

  const handleLogout = () => {
    dispatch(logout(navigate));
  }; //비동기라 navigate 를 사용할 수 있게 넘겨줘야함

  const [sort, setSort] = useState("");

  useEffect(() => {
    const sortFromQuery = query.get("sort");
    if (sortFromQuery) setSort(sortFromQuery);
    else {
      setSort("");
    }
  }, [query]);

  const handleSortChange = (value) => {
    setSort(value);
    navigate(`?sort=${value}`, { replace: true }); // URL 업데이트
    //호출은랜딩에서!
  };
  return (
    <div>
      {showSearchBox && (
        <div className="display-space-between mobile-search-box w-100">
          <div className="search display-space-between w-100">
            <div>
              <FontAwesomeIcon className="search-icon" icon={faSearch} />
              <input
                type="text"
                placeholder="제품검색"
                onKeyPress={onCheckEnter}
              />
            </div>
            <button
              className="closebtn"
              onClick={() => setShowSearchBox(false)}
            >
              &times;
            </button>
          </div>
        </div>
      )}

      {showSortOptions && (
        <div className="display-space-between mobile-search-box w-100">
          <div className="sort display-space-between w-100">
            <div className="sort-area">
              <button
                onClick={() => setSortDropdownOpen(!sortDropdownOpen)}
                className={`sort-button ${sort ? "selected" : ""}`}
              >
                {[
                  { value: "recommended", label: "추천순" },
                  { value: "latest", label: "최신순" },
                  { value: "lowPrice", label: "낮은 가격순" },
                  { value: "highPrice", label: "높은 가격순" },
                ].find((o) => o.value === sort)?.label || "정렬하기"}
              </button>

              {sortDropdownOpen && (
                <div className="sort-options">
                  {[
                    { value: "recommended", label: "추천순" },
                    { value: "latest", label: "최신순" },
                    { value: "lowPrice", label: "낮은 가격순" },
                    { value: "highPrice", label: "높은 가격순" },
                  ].map((o) => (
                    <div
                      key={o.value}
                      onClick={() => {
                        handleSortChange(o.value);
                        setSortDropdownOpen(false);
                      }}
                      className={`sort-option ${
                        sort === o.value ? "selected" : ""
                      }`}
                    >
                      {o.label}
                    </div>
                  ))}
                </div>
              )}
            </div>
            <button
              className="closebtn"
              onClick={() => setshowSortOptions(false)}
            >
              &times;
            </button>
          </div>
        </div>
      )}

      <div className="side-menu" style={{ width: width }}>
        <button className="closebtn" onClick={() => setWidth(0)}>
          &times;
        </button>

        <div className="side-menu-list" id="menu-list">
          {menuList.map((menu, index) => (
            <button key={index}>{menu}</button>
          ))}
        </div>
      </div>

      {user && user.level === "admin" && (
        <Link to="/admin/product?page=1" className="link-area">
          Admin page
        </Link>
      )}
      <div className="nav-header">
        <div className="burger-menu hide">
          <FontAwesomeIcon icon={faBars} onClick={() => setWidth(250)} />
        </div>

        <div>
          <div className="display-flex">
            {user ? (
              <div onClick={handleLogout} className="nav-icon">
                <FontAwesomeIcon icon={faUser} />
                {!isMobile && (
                  <span style={{ cursor: "pointer" }}>로그아웃</span>
                )}
              </div>
            ) : (
              <div onClick={() => navigate("/login")} className="nav-icon">
                <FontAwesomeIcon icon={faUser} />
                {!isMobile && <span style={{ cursor: "pointer" }}>로그인</span>}
              </div>
            )}
            <div onClick={() => navigate("/cart")} className="nav-icon">
              <FontAwesomeIcon icon={faShoppingBag} />
              {!isMobile && (
                <span style={{ cursor: "pointer" }}>{`쇼핑백(${
                  cartItemCount || 0
                })`}</span>
              )}
            </div>
            <div
              onClick={() => navigate("/account/purchase")}
              className="nav-icon"
            >
              <FontAwesomeIcon icon={faBox} />
              {!isMobile && <span style={{ cursor: "pointer" }}>내 주문</span>}
            </div>

            {isMobile && (
              <div className="nav-icon" onClick={() => setShowSearchBox(true)}>
                <FontAwesomeIcon icon={faSearch} />
              </div>
            )}

            {isMobile && (
              <div
                className="nav-icon"
                onClick={() => setshowSortOptions(true)}
              >
                <FontAwesomeIcon icon={faSort} />
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="nav-logo">
        <Link to="/">
          <img width={100} src="/image/hm-logo.png" alt="hm-logo.png" />
        </Link>
      </div>

      <div className="nav-menu-area">
        <ul className="menu">
          {menuList.map((menu, index) => (
            <li key={index}>
              <a href="#">{menu}</a>
            </li>
          ))}
        </ul>

        {!isMobile && ( // admin페이지에서 같은 search-box스타일을 쓰고있음 그래서 여기서 서치박스 안보이는것 처리를 해줌
          <div className="search-box landing-search-box ">
            <FontAwesomeIcon icon={faSearch} />
            <input
              type="text"
              placeholder="제품검색"
              onKeyPress={onCheckEnter}
            />
          </div>
        )}

        {!isMobile && (
          <div className="sort-area">
            <div className="landing-sort-box ">
              <FontAwesomeIcon icon={faSort} />
              <button
                onClick={() => setSortDropdownOpen(!sortDropdownOpen)}
                className={`sort-button ${sort ? "selected" : ""}`}
              >
                {[
                  { value: "recommended", label: "추천순" },
                  { value: "latest", label: "최신순" },
                  { value: "lowPrice", label: "낮은 가격순" },
                  { value: "highPrice", label: "높은 가격순" },
                ].find((o) => o.value === sort)?.label || "정렬하기"}
              </button>

              {sortDropdownOpen && (
                <div className="sort-options">
                  {[
                    { value: "recommended", label: "추천순" },
                    { value: "latest", label: "최신순" },
                    { value: "lowPrice", label: "낮은 가격순" },
                    { value: "highPrice", label: "높은 가격순" },
                  ].map((o) => (
                    <div
                      key={o.value}
                      onClick={() => {
                        handleSortChange(o.value);
                        setSortDropdownOpen(false);
                      }}
                      className={`sort-option ${
                        sort === o.value ? "selected" : ""
                      }`}
                    >
                      {o.label}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Navbar;
