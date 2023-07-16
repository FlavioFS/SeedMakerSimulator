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

Profile.saveProfiles = (profileIndex, profileList) => {
    localStorage.setItem("profileIndex", profileIndex);
    localStorage.setItem("profileList", JSON.stringify(profileList));
}

Profile.loadProfiles = function () {
    return {
        profileIndex: parseInt(localStorage.getItem("profileIndex")) || 0,
        profileList: JSON.parse(localStorage.getItem("profileList")) || this.pushNewProfile([])
    };
}