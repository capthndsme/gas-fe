import { HelmetProvider } from "react-helmet-async"
import { BrowserRouter, Routes, Route, Link } from "react-router-dom"
import { toast, ToastContainer } from "react-toastify"
import HomePage from "./screens/HomePage"
import "./App.css"
// import toastify css
import "react-toastify/dist/ReactToastify.css"
import { getToken, onMessage } from "firebase/messaging"
import { messaging } from "./config/firebaseConfig"
import { useCallback, useEffect } from "react"
import { useAxiosWithAuth } from "./hooks/useAxiosWithAuth"

function App() {
  const axios = useAxiosWithAuth();
  const requestPermission = useCallback(async () => {
    //requesting permission using Notification API
    try {
      const permission = await Notification.requestPermission();

      if (permission === "granted") {
        const token = await getToken(messaging, {
          vapidKey: "BNN2xmN7s-rLsePMslK3Eq1aBSiKdkXeTYihQQeG1KN6sAK15FWnc0R4vr4fbiTPuV2qOrX8_feEls39NOgp8kI",
        });

        //We can send token to server
        console.log("Token generated : ", token);
        toast.success("You can now receive notifications")
        await axios.post("/register-token", { token })
      } else if (permission === "denied") {
        //notifications are blocked
        toast.warn(<div>
          Notifications are blocked<br />
          Please allow notifications to continue
        </div>)
      }
    }
    catch (e: any) {
      toast.warn(<div>
        Something went wrong while requesting permission<br />
        Please try again<br />
        {e?.message}
      </div>)
      console.error(e)
    }
  }, [])

  useEffect(() => {
    // Handle incoming messages. Called when:
    // - a message is received while the app has focus
    // - the user clicks on an app notification created by a service worker
    //   `messaging.onBackgroundMessage` handler.
    const unsubscribe = onMessage(messaging, (payload) => {
      console.log("Message received. ", payload);
      // Customize notification display here

      if (payload.notification) toast.info(payload.notification.body);
    });

    return () => {
      unsubscribe();
    };
  }, []);

  return (
    <BrowserRouter>
      <HelmetProvider>
        <div className="simplenav ">
          <div className=" max-width">
            Gas Sensor
            <Link to="/settings" style={{marginLeft: "1em", display: "inline-block", textDecoration: "none"}}></Link>
          </div>
        </div>
        <Routes>
          <Route index element={<HomePage requestPushPermission={requestPermission} />} />
        </Routes>
      </HelmetProvider>
      <ToastContainer />

    </BrowserRouter>
  )
}

export default App
