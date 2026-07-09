
import { useTheme } from "../context/ThemeContext";
import "./Settings.css";
import { useEffect, useState } from "react";



function Settings() {


  
  const { theme, setTheme } = useTheme();
  const [themeMode, setThemeMode] = useState("light");
  const [showBankForm, setShowBankForm] = useState(false);
  const [editing, setEditing] = useState(false);
  const [activeTab, setActiveTab] = useState("profile");
  const [profile, setProfile] = useState({
  ownerName: "Shubham Rathod",
  photo: "https://media.licdn.com/dms/image/v2/D4D22AQHINU3hM-Ik3w/feedshare-shrink_800/B4DZ4fisqIK4Ac-/0/1778645650325?e=1784160000&v=beta&t=brAVc0XtQYC_TsbEFRaltP5ZOGKnvR_mjcExmeXKe9I",
  shopName: "Smart Khatabook",
  email: "shubham054@gmail.com",
  mobile: "9876543210",

  
});
 

 const [banks, setBanks] = useState([
  {
    id: 1,
    holder: "Shubham Rathod",
    bank: "HDFC Bank",
    account: "XXXX XXXX 4528",
    ifsc: "HDFC0001234",
    upi: "shubham@okhdfc",
    primary: true,
    qr: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMwAAADACAMAAAB/Pny7AAAAY1BMVEX///8AAADp6enBwcE2Njb6+vpTU1P29va9vb2VlZXKysovLy9tbW2jo6NnZ2eMjIx7e3tCQkIcHBxbW1tKSkoODg4hISGFhYWpqang4ODS0tK2trbY2Njw8PCdnZ0WFhYoKCgZ7pvdAAAN8UlEQVR4nO2d6YKyOgyGRwRBcUEREBDw/q/y0ERJTCubzIzfHN5fTG0LzwBdkrR8fc2aNWvWrFmzZs2aNet/L2fjLXsooxKWKpA7cKh+8lxRpUXFNuxEOSVDQtbnvN7GGQBj7X27W35AJTZxnRAV6tA7qt9SUWV2boptKbWImtQQEoJeJ95bQ2BWiz5iV7WEBIDJT+pQwmxuTbGQwVBlZ0jY9jrx6udgYiOM/0/CeGaYf+7OwFv/4jGjO7OiVPfHYJJs80rLlRFmG9QqIQO0N1miEoAL7sytVFVe1d9OrjLDKbKtgFktX544S0bCXF5ncPZGGNCaUnNFEENTDHfGXlINB5U3huNEwOxbWt7LSJjdOJgDXYpnq9uBMIrL9gSMPRhm97swPrsz/zzM/c6oNu5GMF9rlff2szDOVbyCqRHmCq/z6fWduaqmIMmpTSlVQmBsABAmFSe+Om/DWIF9fFJihHGsWq79+s6oDEW6bio750WdYPnqODbCJM/ntQPrbZh0v3hWYIRBGWF8Gli6h6aaUw4JVK8GE4gT79O3Yay3YW5GmBhgzCOAFzDv35n3Ycx35kNhHBDCVKfTYq3DOHcVh+hUi8Oc7qpWHwGzW9fCNtfL8/zCpmwAcwrK9V3lpc6QlwTjQALI+wiYozpMjPUADBP2MxbBaPptmHN/GBwBpDPMx8H4BFN5xhK/DROEYbgqqbCb1sKxB4O51bnCba5+26zqwz0cyincr8MUtSxmWfLOavCRCpjAqrPhcGYLJeDw/GkwUmzazGEULnaaYAPAKYD/8TBk0OiEsT8eht0ZsmJ8Bsw2OnFF2hTAISHMrR7URGmd/uUdK1VEg6mzuusumEScePs+TJGXO65yKWHyy0MlTqp2dYlyBylQYiVgbCix74JZihPnxdswZmnDGVRBOaAGGEA7iYBhaoMx65thzkaYEGCAIJhhZpjXMKX7UoWEqfxaC0v95nTBRCqvfyIYB+pkMMXrM5cjYU7+a0UCJlEX5BzrX2KcabbAhPDvYP3MIfb9W0gwUcuJTyNhOqWNmpkNoA0G7kaLRbNTM8z/CWYvYXwTjIMwjgnGlzByJDgBTHFZ91FOMKEyzHjKDHNYEswejC/wn1mBCQYsOaUHNprm0AsJJu914kvx+trfE+tnWP8Qmv6jMVlnFmhqot+0edqvqKXTlNIMGppF87c1w3wqDDMnsdSjBFGqYDJU/AbMjs4kzWI40GTRCdwNSJaaJYEm0M+sm7+5EZA1zeyGAvgGajAbDAfpEtEFGmH6+TRRctT8AoZ1muAJyeAhNhsMZ5i/DoPDjj39vTHDUPQPwBTJx8C4y8YOg2YXvB6wtdBV3mE8k3XG2SiLy2EcjEVmoFzGGQ6HYfbA6ErZZCOMMMw6Q6NmlOZs6gdzpQ7tPGSg+QKGzhQzGNZpMhjjFACl+Wd6wtBQftCoeYb5bJiSXaD6u2Bn6oRBt60arLlQbCvemUXnCADjh6Bxh8EAe2dGwHxRG7tcRNHiTAR1P1MnaHYzBiMqQNX9TF0sFKkcBnSNGxgUFEMvwHBTkyZPVXEkD/8LI6CEkWLT5laYmwazGO/SMMOcfwxGvzN/DWasf0ZTrqqwGQzaK4bCoElGm7lImBQeMxa2gv8DcMbBO3McAuPCYIS1WNey1oWqcPISUtTQAtqb1U79Gb+Gse7DIJWNnUj5pHL4z9g0WllXUA8fPNXF0Nm0gfMOsc5YYXQ6PXkByMvH/s5UTFIMvVGiUrQQLaaNXZ2qetr8XA9GNUENUUwuP7jDFf3JijnySrphulwaqCs9W5pFU4NRj44vh79s2tymt0bNPWGyITAiFPjjYP6lO3Nx2lXDqHfmDtPnnTm2vDOaKnp9EGbw28Jh7LBdq8RK07SAUZivEvbRaxgMD1qvwvDMFkR9qVRLhi+g8rp2yzs2MGlQF14NN9QM9wIwdXaaK5mcGOp+NTlrWW3xHsykI4BuGHVR0QzTR/iYmW0A08Nk7z9mfqB8QtI7VyXkKgKvEcsgYZxM+ZYy4Tn7ulIQ8K7xIpXwn7EP9WGSChhrp5J36pzLIdYZBrPKHNd1PAETq1Q3U97/KnWfM0gYN4l9P06kT3MdN97wpfPw8t/tcSoOoHAEzBfk2IGbfaRPcwXDzeXiWTdIxU7TEhk0mBYHLYoWb2kRGpoRcGyEBoPR7gykZn8J5h+5M+Ht/jzfQnzMquegDztzH+9MBBVvmtiUmC1sgHfBSurKbnf/jHri9xRugvIcip1RebdFE4Nzh6EMw2EcWk2VwTyokCsn12qN1SFrVmQWYh3X/f+awNosSAVLLSy98mCBFmvR91AZlIBFYbn6e3slmFDVU46MBOymlV4As9g6TSZrYdKRMlxhpsn6GUQeubKpU23Rs0xyZRMqNcKYDRoMZjKDhtQfhOl8zHBlUyZSu2HoMbsaH7MRLg0mcwOAU1FqLLAtsODQbWDiXfbcLFhb0QDgO0MLQqEBCFS7kV1gvscagKUqvH4rdsbcNGNj2TTj/n3bCVs16Sx8Xv2OTfNdsmkGRfajGmyanQTKwXyPNc0sBHKszJ0mSkZotCxsYHIkDJMWPj+BT3MszOuFDX8WZr14qYlhWOwt/G1+Z+5Bv/Bsd8KI8F58Z/BFqZpDGw739M6AMORGu6ieKmAepHTYQSto5UIQ84eWkqWaXx26YM4imO8AY9nbsokEtNUhbmcBk7MDLeHM8RrYRQ2yNTMvtewlQFo/Y96qRS6g09QWcCr7WtZ/DupntCmAGaZz35lJYcY6aP8qzLkFRnvMMNAEYKzpYUZ6m8k8u9puwAYLBOrofpisHubZ9D6JqjOfr8rYeoFOUxWzLsr0Hx3JoAuBz6e9OrYJpjyrE6nKMKIlVgs50R3s0CnAPIvFxuw7owzVqVpz9ghqqA8rtBST4RzvASb4ytgNrSsujYfDpyX0cEMdseYMfkvJc7UlE3l2Vqvyc8r21r4z+L9iERrM7M1sACjjU6VtbmBeDcimbNwGQIZz1ARLG80wzDrzbTBTWWc+4s5MYZ1pHLQPmPoZfsA03qYM3xnyPqllmXElYG6bxsP0ZNGsC1dHcj5ZzQ4U0R6GK/DL4zFrsg2HYa5zhAkvZblbQ8XnS9mo8Yajdsr7neNWOqRToHJ4cpXGBvzu6qc19EnurvGUe9jEqxoTGPQF5Dp/a9qsLQdm0rwAeBE3U96tMAKicGHD0nRibSlN+L51pg3GvBoQRwBS0qKJKlpgplrb/GdhWhZOmWG8T4eJmBaPhGZtcxRVlRmGCshlWhxGjsIeMM9newTP1YfDmmbZYbCt8aBzQeNLSgSbhUloQ5dePoBxzb4/zED9DA6VmQltAp8miziHy27zz/BiFHAqYboNGqDvcNDOMJ8Co/n26TcgwHcGx2ZFCwyFzw+B4dvzvQ/jsq0kzg2M66llCfDiVofd43Cxhl0hYHACff8eysG4ICwfP90j+mhBlJNBihHmSBtOJP7bMEzYNMuFDZowRAsIsOWjvCdqedHypw1nOjUZjJwCtMHItc0g8xQANSTe7CNgtD0BZ5hJYHDryaQfDG4KClMratw5DLwzzEL1wzDdYn2SOcOLQD/K0BlSJ5ec2JP6NLnMy4FJWqcJitm8Xkaco6RL4731M98LY14/M8NMKGkDkHLMg/0hMG+tbBq07cSSQvpKU64DXcTt4DWZmS+dwcC2ExfpBtxClCAUCwbDDIrRZPI7CtjmCbLcEOQ7NmvrlHkj3TYYs6fVvJP2DPP/gOm58RQI40Hs52I22mnABX5jMC753dFJzmBUJGAgYWIIQlFhusXY6NmeW4KBllGDeGg8/l+5ahF8FenrLGn9TFrnvdn37TSaOICz5GQwuaohCxXTxWkyDIL5ru8CgIXq1LkhiLnTHGvQ+FaY7t1NjDCjrTPf9fmJfwmGWT9ZJODm1BD0hGGjoHwimO5NQSUMmGTWRQNzSsh8Q1ZdDca/PJ1nd4FR0BkcWulEMN3btUoYyB+xCA3YsjUoGk+eGWZxEsLW3/p6FJsCpt9GupoRsCXe7AWMUVvqUWaYGQZh2DdJhsDgp0/okA3xEMZVe4pvfhgmSx/SNmxvg4G92zM6XJLv7R5mrkKAzqefhZFjpp4w0NpjhAauyyHnO8JQl/ODMNKgMRZG3hlyf/xTMNnnwvCd5+gRRBgYb7EIjc+AAYMLmHPYBnpos0noqkKK6cXPTySQgHt8Qg39YIKR6zR7wqwqGOSI9e2hCHCCXSXYqHlRQQIMVpLmEzudMFCs+ukPgxi3nmQfBkGxgNNFPxjQR8DYvwzT/Wmwb7gzFLE28Z3p/GgbwASu+mqbhImPzTfZ4HAF7VZqN6kMplIfR/Gxnzk3ZwtS9W23tbiG7UiY7s/pAcxRLazas0YGYLawugtNrrTo04V6AgGDy7QwQ7PyK8vhi5wX8WXP6xDzzFRb6a9hV0O41kSefy1gzNu1aqHAw/Vd3wXgNZi3Bddg3t968g/C9Pxsq9nZxGAwglju32D+bKvUdSqYnh/UPcC7DzBekwH/o7hh+wWWVrLXF2Dgg7oHgoEGAMcprAHAdZoMxhrZAHSqbdq8aGBQ5k8dfxEMCvsZGefNYGB/s7ErmyaDMX6E+gWMDFmdaqeGyWCMnwf/V2F+787se33Zni3Y2MSGDLc1wWTnppjmcDvcHr9VOJw5PtdzYn7dS30ifz9o24mNt+whturRMhXwWKtjUbIWxpw1hfP7JheiHnbtaZ3X24zYGWzWrFmzZs2aNWvWrFl/Tf8BhDuPB86gPMMAAAAASUVORK5CYII=",
  },
  ]);

      const [bankForm, setBankForm] = useState({
      holder: "",
      bank: "",
      account: "",
      ifsc: "",
      upi: "",
      qr: "",
      });

      const saveBank = () => {

      const newBank = {
        id: Date.now(),
        holder: bankForm.holder,
        bank: bankForm.bank,
        account: bankForm.account,
        ifsc: bankForm.ifsc,
        upi: bankForm.upi,
        primary: false,
        qr: bankForm.qr,
      };

      setBanks([...banks, newBank]);

      setShowBankForm(false);

      setBankForm({
        holder: "",
        bank: "",
        account: "",
        ifsc: "",
        upi: "",
        qr: "",
      });

    };

    



          return (

            
            
          <div className="settings-container">
            <div className="settings-header">
              <h1>⚙️ Settings</h1>
              <p>Manage your business preferences</p>
            </div>



            <div className="settings-tabs">
              
                    <button
                      className={`setting-tab ${activeTab === "profile" ? "active" : ""}`}
                      onClick={() => setActiveTab("profile")}
                    >
                      Profile
                    </button>

                    <button
                      className={`setting-tab ${activeTab === "payment" ? "active" : ""}`}
                      onClick={() => setActiveTab("payment")}
                    >
                      Payment

                    </button>

                    <button
                      className={`setting-tab ${activeTab === "security" ? "active" : ""}`}
                      onClick={() => setActiveTab("security")}
                    >
                      Security
                    </button>

                    <button
                      className={`setting-tab ${activeTab === "theme" ? "active" : ""}`}
                      onClick={() => setActiveTab("theme")}
                    >
                      Theme
                    </button>

                    <button
                      className={`setting-tab ${activeTab === "backup" ? "active" : ""}`}
                      onClick={() => setActiveTab("backup")}
                    >
                      Backup
                    </button>

               </div>     

            <div className="settings-card">
            <div className="profile-summary">

            

            {activeTab === "profile" && (
              <div className="profile-card">
              <div className="profile-top">
              <div className="profile-avatar">
                      <img
                        src={profile.photo}
                        alt="Profile"
                        className="profile-photo"
                      />
                    </div>

              <div className="profile-main">

              <div className="profile-name-row">
                  <h2>Shubham Rathod</h2>
                    
                  </div>

              <div className="profile-tags">
                <span>🏪 Smart Khatabook</span>
                <span>OWNER</span>
                <span>BUSINESS ACCOUNT</span>
              </div>

              <div className="profile-address">
                📍 Wagholi, Pune, Maharashtra
              </div>

            </div>

    <button
          className="edit-profile-btn"
          onClick={() => setEditing(true)}
        >
          Edit Profile
    </button>

  </div>

  <div className="profile-bottom">

              <div className="info-box">
                <h4>Email</h4>
                <p>shubham054@gmail.com</p>
              </div>

              <div className="info-box">
                <h4>Phone</h4>
                <p>9876543210</p>
              </div>

              <div className="info-box">
                <h4>Aadhaar</h4>
                <p>XXXX XXXX 1234</p>
              </div>

              <div className="info-box">
                <h4>City</h4>
                <p>Pune</p>
              </div>

  </div>


   

  </div>
  


)}

{/* payment butten */}

{activeTab === "payment" && (

/* First Card */
<div className="payment-card">

    <div className="payment-header">
        <div>
            <h2>Business Bank Account</h2>
            <p>
                Manage your payment methods and receive payments securely.
            </p>
        </div>

        <button
            className="primary-btn"
            onClick={() => setShowBankForm(true)}
        >
            + Add New Bank
        </button>
    </div>

    {banks.map((bank) => (

    <div className="bank-card" key={bank.id}>

        <div className="bank-left">

            <div className="bank-icon">
                🏦
            </div>

            <div>

                <h3>{bank.bank}</h3>

                <p className="acc-name">
                    {bank.holder}
                </p>

                <p className="acc-no">
                    {bank.account}
                </p>

                {bank.primary && (
                    <span className="primary-badge">
                        Primary Account
                    </span>
                )}

            </div>

        </div>

        <div className="bank-right">

            <img
                src={bank.qr}
                alt="QR"
                className="bank-qr"
            />

        </div>

    </div>

    ))}
    {/* Second Card */}
    
                    {showBankForm && (
                      <div className="bank-form-card">

                        <h3>Add New Bank Account</h3>

                        <div className="payment-form">

                          <div className="input-box">
                            <label>Account Holder Name</label>

                            <input
                              type="text"
                              placeholder="Enter Name"
                              value={bankForm.holder}
                              onChange={(e) =>
                                setBankForm({
                                  ...bankForm,
                                  holder: e.target.value,
                                })
                              }
                            />
                          </div>

                          <div className="input-box">
                            <label>Bank Name</label>
                            <input
                                type="text"
                                placeholder="Enter Bank Name"
                                value={bankForm.bank}
                                onChange={(e) =>
                                  setBankForm({
                                    ...bankForm,
                                    bank: e.target.value,
                                  })
                                }
                              />
                          </div>

                          <div className="input-box">
                            <label>Account Number</label>
                            <input
                                type="text"
                                value={bankForm.account}
                                onChange={(e) =>
                                  setBankForm({
                                    ...bankForm,
                                    account: e.target.value,
                                  })
                                }
                              />
                          </div>

                          <div className="input-box">
                            <label>IFSC Code</label>
                            <input
                                type="text"
                                value={bankForm.ifsc}
                                onChange={(e) =>
                                  setBankForm({
                                    ...bankForm,
                                    ifsc: e.target.value,
                                  })
                                }
                              />
                          </div>

                          <div className="input-box">
                            <label>UPI ID</label>

                            <input
                              type="text"
                              placeholder="Enter UPI ID"
                              value={bankForm.upi}
                              onChange={(e) =>
                                setBankForm({
                                  ...bankForm,
                                  upi: e.target.value,
                                })
                              }
                            />
                          </div>

                          <div className="input-box">
                            <label>Upload Bank QR</label>
                            <input
                                type="file"
                                accept="image/*"
                                onChange={(e) => {
                                  const file = e.target.files[0];

                                  if (file) {
                                    setBankForm({
                                      ...bankForm,
                                      qr: URL.createObjectURL(file),
                                    });
                                  }
                                }}
                              />
                          </div>

                        </div>

                        <div className="payment-buttons">

                          <button
                            className="secondary-btn"
                            onClick={() => setShowBankForm(false)}
                          >
                            Cancel
                          </button>

                          <button
                            className="save-btn"
                            onClick={saveBank}
                          >
                            Save Bank
                          </button>

                        </div>

                      </div>
                    )}
                        
</div>




)}



{/* security butten */}


{activeTab === "security" && (
  <div className="feature-card">

            <h2>🔐 Security Settings</h2>

            <div className="feature-grid">

              <div className="feature-box">
                <h4>Login ID</h4>
                <input
                  type="email"
                  placeholder="Enter Login ID"
                />
              </div>

              <div className="feature-box">
                <h4>Current Password</h4>
                <input
                  type="password"
                  placeholder="Current Password"
                />
              </div>

              <div className="feature-box">
                <h4>New Password</h4>
                <input
                  type="password"
                  placeholder="New Password"
                />
              </div>

              <div className="feature-box">
                <h4>Confirm Password</h4>
                <input
                  type="password"
                  placeholder="Confirm Password"
                />
              </div>

            </div>

            <div className="settings-footer">
              <button className="save-btn">
                Update Security
              </button>
            </div>

  </div>
)}

{/* Theme button */}
{activeTab === "theme" && (

          <div className="theme-card">
                              

                              <div
                  className={`theme-option ${theme === "light" ? "active" : ""}`}
                  onClick={() => setTheme("light")}
                >
                  <div>
                    <h4>🌞 Light Mode</h4>
                    <p>Bright appearance</p>
                  </div>

                  <input
                    type="radio"
                    checked={theme === "light"}
                    readOnly
                  />
                </div>

                <div
                  className={`theme-option ${theme === "dark" ? "active" : ""}`}
                  onClick={() => setTheme("dark")}
                >
                  <div>
                    <h4>🌙 Dark Mode</h4>
                    <p>Dark appearance</p>
                  </div>

                  <input
                    type="radio"
                    checked={theme === "dark"}
                    readOnly
                  />
                </div>

                <div
                  className={`theme-option ${theme === "eye" ? "active" : ""}`}
                  onClick={() => setTheme("eye")}
                >
                  <div>
                    <h4>🛡 Eye Protection</h4>
                    <p>Warm colors for eyes</p>
                  </div>

                  <input
                    type="radio"
                    checked={theme === "eye"}
                    readOnly
                  />
                </div>


                          </div>

                )}


                  <div className="feature-card">

                      
                  </div>

                  <div className="feature-card">


  </div>
                         

</div>
         
</div>



  <div className="settings-footer">

  </div>
            

  </div>
 );
        
}

export default Settings;