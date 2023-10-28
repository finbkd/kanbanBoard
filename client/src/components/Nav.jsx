import React, { useContext } from "react";
import { AuthContext } from "../utils/AuthContext";
// import {
// 	NovuProvider,
// 	PopoverNotificationCenter,
// 	NotificationBell,
// } from "@novu/notification-center";
// import { useNavigate } from "react-router-dom";

const Nav = () => {
  const { isLoggedIn, user, setUser, setIsLoggedIn } = useContext(AuthContext);
  console.log(user);

  // const navigate = useNavigate();

  // const onNotificationClick = (notification) =>
  // 	navigate(notification.cta.data.url);
  return (
    <nav className="navbar">
      <h3>Welcome, User</h3>
      <h3
        className="logoutContainer"
        onClick={() => {
          setIsLoggedIn(false);
          localStorage.setItem(
            "isloggedIn",
            JSON.stringify({ isLoggedIn: false })
          );
        }}
      >
        Logout
      </h3>
      {/* <div>
				<NovuProvider
					subscriberId='<SUBSCRIBER_ID>'
					applicationIdentifier='<APP_ID>'
				>
					<PopoverNotificationCenter
						onNotificationClick={onNotificationClick}
						colorScheme='light'
					>
						{({ unseenCount }) => (
							<NotificationBell unseenCount={unseenCount} />
						)}
					</PopoverNotificationCenter>
				</NovuProvider>
			</div> */}
    </nav>
  );
};

export default Nav;
