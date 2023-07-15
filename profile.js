const Profile = {
    profileList: [],
    lastProfileIndex: 0
}

Profile.createFarmSlots = () => {
    const slots = [];
    
    for (let y = 0; y < 65; y++) {
        slots.push(new Array(80).fill(false));
    }
    
    return slots;
}

Profile.createProfile = function () {
    const newProfile = {
        name: `Farm ${this.profileList.length + 1}`,
        gameID: 123456789,
        year: 1,
        season: 1,
        day: 1,
        farmSlots: this.createFarmSlots()
    };

    return newProfile;
};

Profile.saveProfiles = function (currentProfileID, newProfileList) {
    localStorage.setItem("lastProfileIndex", currentProfileID);
    localStorage.setItem("profileList", newProfileList);
}

Profile.loadProfiles = function () {
    this.profileList = localStorage.getItem("profileList") || [];
}

Profile.getCurrentProfile = function () {
    return this.profileList[this.lastProfileIndex];
}

Profile.init = function () {
    this.loadProfiles();

    if (this.profileList.length <= 0)
    {
        this.lastProfileIndex = 0;
        this.profileList.push(this.createProfile());
    }
    else
    {
        this.lastProfileIndex = parseInt(localStorage.getItem("lastProfileIndex")) || 0;
        if (this.lastProfileIndex >= this.profileList.length || this.lastProfileIndex < 0) {
            this.lastProfileIndex = 0;
        }
    }
}

Profile.init();