const Profile = {}

Profile.createFarmSlots = () => {
    const slots = [];
    
    for (let y = 0; y < 65; y++) {
        slots.push(new Array(80).fill(false));
    }
    
    return slots;
}

Profile.pushNewProfile = function (profileList) {
    const newProfile = {
        name: `Farm ${profileList.length + 1}`,
        gameID: 123456789,
        year: 1,
        season: 1,
        day: 1,
        farmSlots: this.createFarmSlots()
    };

    profileList.push(newProfile);
    return profileList;
};

Profile.deleteProfile = (profileIndex, profileList) => {
    if (profileIndex >= 0 && profileIndex < profileList.length)
    {
        profileList.splice(profileIndex, 1);
        return true;
    }
    
    return false;
};

Profile.saveProfiles = (currentProfileID, newProfileList) => {
    localStorage.setItem("profileIndex", currentProfileID);
    localStorage.setItem("profileList", newProfileList);
}

Profile.loadProfiles = function () {
    return {
        profileIndex: localStorage.getItem("profileIndex") || 0,
        profileList: localStorage.getItem("profileList") || this.pushNewProfile([])
    };
}

// Profile.init = function () {
//     this.loadProfiles();

//     if (this.profileList.length <= 0)
//     {
//         this.lastProfileIndex = 0;
//         this.profileList.push(this.createProfile());
//     }
//     else
//     {
//         this.lastProfileIndex = parseInt(localStorage.getItem("profileIndex")) || 0;
//         if (this.lastProfileIndex >= this.profileList.length || this.lastProfileIndex < 0) {
//             this.lastProfileIndex = 0;
//         }
//     }
// }