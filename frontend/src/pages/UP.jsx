import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Profilepage.css";

const Profilepage = () => {
  const [profilePicture, setProfilePicture] = useState("https://img.freepik.com/free-vector/blue-circle-with-white-user_78370-4707.jpg");
  const [pic, setPic] = useState([]); 
  const [bio, setBio] = useState(""); 
  const [displayBio, setDisplayBio] = useState(""); 
  const [isEditingBio, setIsEditingBio] = useState(false); 
  const navigate = useNavigate();

  useEffect(() => {
    fetch("http://localhost:5000/myposts", {
      headers: {
        Authorization: "Bearer " + localStorage.getItem("jwt"),
      },
    })
      .then((res) => res.json())
      .then((result) => {
        console.log(result);
        setPic(result || []); 
        console.log(pic);
      })
      .catch((error) => {
        console.error("Error fetching posts:", error);
      });
  }, []);

  const handleProfilePictureUpload = (event) => {
    const file = event.target.files[0];
    const reader = new FileReader();

    reader.onload = () => {
      setProfilePicture(reader.result);
    };

    if (file) {
      reader.readAsDataURL(file);
    }
  };

  const handleBioChange = (e) => {
    setBio(e.target.value);
  };

  const handleBioSubmit = (e) => {
    e.preventDefault();
    setDisplayBio(bio);
    setBio("");
    setIsEditingBio(false);
  };

  const handleEditBio = () => {
    setIsEditingBio(true);
  };

  return (
    <div className="profile-page">
      <div className="profile-page__header">
        <div className="profile-page__user-info">
          <div
            className="profile-page__picture"
            style={{ backgroundImage: `url(${profilePicture})` }}
          ></div>
          <input
            type="file"
            className="profile-page__file-input"
            style={{ display: "none" }}
            onChange={handleProfilePictureUpload}
          />
          <button
            className="profile-page__upload-btn"
            onClick={() => document.querySelector(".profile-page__file-input").click()}
          >
            Upload Profile Picture
          </button>
          <div className="profile-page__bio-section">
            {isEditingBio ? (
              <form onSubmit={handleBioSubmit}>
                <textarea 
                  className="profile-page__bio-textarea"
                  value={bio}
                  onChange={handleBioChange}
                  placeholder="Enter your bio"
                />
                <br />
                <button className="profile-page__bio-btn" type="submit">Submit</button>
              </form>
            ) : (
              <div>
                {displayBio ? (
                  <div>
                    <p className="profile-page__bio-text">{displayBio}</p>
                    <button className="profile-page__bio-btn" onClick={handleEditBio}>
                      Update Bio
                    </button>
                  </div>
                ) : (
                  <button className="profile-page__bio-btn" onClick={handleEditBio}>
                    Add Bio
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
        <div className="profile-page__nav-buttons">
          <button className="profile-page__nav-btn profile-page__nav-btn--create">
            <Link to="/thread">Create Post</Link>
          </button>
          <button className="profile-page__nav-btn profile-page__nav-btn--coins">
            <Link to="/Coinsearned">Coins</Link>
          </button>
          <button className="profile-page__nav-btn profile-page__nav-btn--reach">
            <Link to="/Reach">Reach</Link>
          </button>
          <button className="profile-page__nav-btn profile-page__nav-btn--course">
            <Link to="/Course">Courses</Link>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Profilepage;