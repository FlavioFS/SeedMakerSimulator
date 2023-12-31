const { createApp, reactive, computed, ref } = Vue
const { createVuetify } = Vuetify

const DAYS_PER_SEASON = 28;
const SEASONS_PER_YEAR = 4;
const DAYS_PER_YEAR = DAYS_PER_SEASON * SEASONS_PER_YEAR; 

function getYear       (daysPlayed) { return Math.floor(daysPlayed / DAYS_PER_YEAR) + 1; }
function getDayOfYear  (daysPlayed) { return daysPlayed % DAYS_PER_YEAR; }
function getSeason     (daysPlayed) { return Math.floor(getDayOfYear(daysPlayed) / DAYS_PER_SEASON) + 1; }
function getDay        (daysPlayed) { return (getDayOfYear(daysPlayed) % DAYS_PER_SEASON); }
function getDaysPlayed (year, season, day) { return (year-1) * DAYS_PER_YEAR + (season-1) * DAYS_PER_SEASON + day }

function formatParams( params ){
    return "?" + Object
        .keys(params)
        .map((key) => key + "=" + params[key])
        .join("&")
}

const vuetify = createVuetify({
    theme: {
        defaultTheme: 'light',
        themes: {
          light: {
            dark: false,
            variables: {},
            colors: {
                primary: '#fbcd8b',
                secondary: '#823102',
                button: '#B14E05',
                buttontxt: '#FEC72E',
                text: '#281726',
                paint: '#CB554F',
                success: '#419825',
                accent: '#8E51C6',
                error: '#b71c1c',
                disabled: '#826665'
            }
          },
        },
      },
});

createApp({
    setup() {
        const SOCIALS = [
            { name: "Website", icon: "public/website.png", url: "https://flafdraws.github.io/art" },
            { name: "Twitter", icon: "public/twitter.png", url: "https://twitter.com/flafdraws" },
            { name: "Instagram", icon: "public/instagram.png", url: "https://instagram.com/flafdraws" },
            { name: "Youtube", icon: "public/youtube.png", url: "https://www.youtube.com/channel/UCLq1fsQwY9fP3dOF8JBhjLw?sub_confirmation=1" },
            { name: "Twitch", icon: "public/twitch.png", url: "https://twitch.com/flafdraws" },
            { name: "Reddit", icon: "public/reddit.png", url: "https://www.reddit.com/user/flafdraws" },
            { name: "Ko-fi", icon: "public/kofi.png", url: "https://ko-fi.com/flafdraws" }
        ];

        const DONATES = [
            { tooltip: "PayPal", icon: "public/paypal.png", url: "https://www.paypal.com/donate/?hosted_button_id=BPLZS6AERTQVY" },
            { tooltip: "Ko-fi", icon: "public/ko-fi.png", url: "https://ko-fi.com/flafdraws" }
        ]

        const DAYHOURS = [
            "06:00", "06:10", "06:20", "06:30", "06:40", "06:50",
            "07:00", "07:10", "07:20", "07:30", "07:40", "07:50",
            "08:00", "08:10", "08:20", "08:30", "08:40", "08:50",
            "09:00", "09:10", "09:20", "09:30", "09:40", "09:50",
            "10:00", "10:10", "10:20", "10:30", "10:40", "10:50",
            "11:00", "11:10", "11:20", "11:30", "11:40", "11:50",
            "12:00", "12:10", "12:20", "12:30", "12:40", "12:50",
            "13:00", "13:10", "13:20", "13:30", "13:40", "13:50",
            "14:00", "14:10", "14:20", "14:30", "14:40", "14:50",
            "15:00", "15:10", "15:20", "15:30", "15:40", "15:50",
            "16:00", "16:10", "16:20", "16:30", "16:40", "16:50",
            "17:00", "17:10", "17:20", "17:30", "17:40", "17:50",
            "18:00", "18:10", "18:20", "18:30", "18:40", "18:50",
            "19:00", "19:10", "19:20", "19:30", "19:40", "19:50",
            "20:00", "20:10", "20:20", "20:30", "20:40", "20:50",
            "21:00", "21:10", "21:20", "21:30", "21:40", "21:50",
            "22:00", "22:10", "22:20", "22:30", "22:40", "22:50",
            "23:00", "23:10", "23:20", "23:30", "23:40", "23:50",
            "00:00", "00:10", "00:20", "00:30", "00:40", "00:50",
            "01:00", "01:10", "01:20", "01:30", "01:40", "01:50"
        ];
        const SEASONS = [
            {
                name: "Spring",
                icon: "public/season-spring.png",
                value: 1
            },
            {
                name: "Summer",
                icon: "public/season-summer.png",
                value: 2
            },
            {
                name: "Autumn",
                icon: "public/season-autumn.png",
                value: 3
            },
            {
                name: "Winter",
                icon: "public/season-winter.png",
                value: 4
            }
        ];

        const profileIndex = ref(0);
        const profileList = ref([]);
        loadSaveFile();

        const gameID = computed(() => getCurrentProfile().gameID);
        const year = computed(() => getCurrentProfile().year);
        const season = computed(() => getCurrentProfile().season);
        const day = computed(() => getCurrentProfile().day);
        const farmSlots = computed(() => getCurrentProfile().farmSlots);

        const coordinates = ref("");
        const coordinatesRaw = ref([]);
        const daySchedule = ref({});
        const isCalculatingSchedule = ref(false);
        const calculationProgress = ref(0);
        updateCoordinates();

        const show1 = ref(true);
        const show2 = ref(true);
        const show3 = ref(true);
        const showMixed = ref(true);
        const showAncient = ref(true);
        const showEmptyHours = ref(true);
        const showPixPopup = ref(false);
        
        const toggleFilter1 = () => show1.value = !show1.value;
        const toggleFilter2 = () => show2.value = !show2.value;
        const toggleFilter3 = () => show3.value = !show3.value;
        const toggleFilterMixed = () => showMixed.value = !showMixed.value;
        const toggleFilterAncient = () => showAncient.value = !showAncient.value;
        const toggleFilterEmptyHours = () => showEmptyHours.value = !showEmptyHours.value;
        const toggleFarmSlot = (x, y) => { farmSlots.value[y][x] = !farmSlots.value[y][x]; debounceSave(); }
        const mouseOverFarmSlot = (x, y) => {
            if (Mouse.down > 0) {
                toggleFarmSlot(x, y);
            }
        }
        const togglePixPopup = () => showPixPopup.value = !showPixPopup.value;

        function clearFarmSlots () {
            for (let y = 0; y < 65; y++) {
                for (let x = 0; x < 80; x++) {
                    farmSlots.value[y][x] = false;
                }
            }

            debounceSave();
        }

        function loadSaveFile () {
            const profiles = Profile.loadProfiles();
            profileIndex.value = profiles.profileIndex;
            profileList.value = profiles.profileList;
        }

        function createNewProfile() {
            Profile.pushNewProfile(profileList.value);
            profileIndex.value = profileList.value.length-1;
            saveProfiles();
        }

        function deleteProfile () {
            const index = profileIndex.value;

            if (profileList.value.length <= 1) {
                profileIndex.value = 0;
                profileList.value = [];
                Profile.pushNewProfile(profileList.value);
            }
            else if (index >= 0 && index < profileList.value.length)
            {
                profileList.value.splice(index, 1);
                if (index >= profileList.value.length) profileIndex.value = profileList.value.length-1;
            }
            
            saveProfiles();
        };

        function saveProfiles() {
            Profile.saveProfiles(profileIndex.value, profileList.value);
            console.log("Saved!");
        }
        
        function debounceSave() {
            Debounce.run(saveProfiles);
        }

        function updateCoordinates() {
            const newCoords = [];
            
            for (let y = 0; y < farmSlots.value.length; y++) {
                const row = farmSlots.value[y];
                for (let x = 0; x < row.length; x++) {
                    const seedmaker = row[x];

                    if (seedmaker === true) {
                        newCoords.push([x,y]);
                    }
                }
            }

            coordinatesRaw.value = newCoords;
            coordinates.value = JSON.stringify(newCoords);

            return newCoords.length > 0;
        }

        function generateDay () {
            if (!updateCoordinates() || isCalculatingSchedule.value) return; // Should display warning
            
            isCalculatingSchedule.value = true;
            calculationProgress.value = 0;
            new Promise((resolve)=>{
                resolve(
                    SeedMaker.daySchedule(gameID.value, daysPlayed.value, coordinatesRaw.value, (percentage) => {
                        calculationProgress.value = percentage;
                    })
                );
            }).then((newSchedule) => {
                daySchedule.value = newSchedule;
            }).finally(() => {
                isCalculatingSchedule.value = false;
            });
        }

        function isSeedVisible(seed) {
            return (
                seed.type === 0 && (
                    (seed.amount === 1 && show1.value === true) ||
                    (seed.amount === 2 && show2.value === true) ||
                    (seed.amount === 3 && show3.value === true)
                )
            )
            || (seed.type === 1 && showMixed.value) 
            || (seed.type === 2 && showAncient.value);
        }

        function isHourVisible(hour) {
            for (let i = 0; i < hour.seeds.length; i++) {
                if (isSeedVisible(hour.seeds[i])) return true;
            }
            return false;
        }

        function openurl(url) {
            window.open(url, "__blank");
        }

        function getCurrentProfile () {
            return profileList.value[profileIndex.value];
        };

        function countSeedMakers(slots) {
            let count = 0;

            for (let y = 0; y < slots.length; y++) {
                for (let x = 0; x < slots.length; x++) {
                    if (slots[y][x] === true) count ++;
                }
            }

            return count;
        }

        function setSeason(value) {
            currentProfile.value.season =  value;
            debounceSave();
        }

        function copyPixToClipboard() {
            copyTextToClipboard("43379701000196");
        }

        const currentSeedMakerCount = computed(() => {
            return countSeedMakers(farmSlots.value);
        });

        const currentProfile = computed(() => getCurrentProfile());

        const currentProfileDaysPlayed = computed(() => {
            const profile = getCurrentProfile();
            return getDaysPlayed(profile.year, profile.season, profile.day);
        });

        const currentProfileSeedMakerCount = computed(() => {
            return countSeedMakers(getCurrentProfile().farmSlots);
        });
        
        const currentSeason = computed(() => SEASONS[season.value-1]);

        const daysPlayed = computed(() => {
            return getDaysPlayed(year.value, season.value, day.value);
        });

        const filteredDaySchedule = computed(() => {
            const filteredResult = JSON.parse(JSON.stringify(daySchedule.value));

            if (filteredResult.hasOwnProperty("hours")) {
                const hours = filteredResult.hours;
                for (let i = hours.length-1; i >= 0; i--) {
                    hours[i].isVisible = isHourVisible(hours[i]);
                }
            }

            return filteredResult;
        });

        const progressPercentage = computed(() => {
            return calculationProgress.value * 100;
        })

        return {
            generateDay,
            gameID,
            currentSeason,
            daysPlayed,
            coordinates,
            year,
            season,
            day,
            farmSlots,
            toggleFarmSlot,
            mouseOverFarmSlot,
            clearFarmSlots,
            loadSaveFile,
            createNewProfile,
            deleteProfile,
            debounceSave,
            profileIndex,
            profileList,
            setSeason,
            currentSeedMakerCount,
            currentProfile,
            currentProfileDaysPlayed,
            currentProfileSeedMakerCount,
            daySchedule,
            isCalculatingSchedule,
            calculationProgress,
            progressPercentage,
            filteredDaySchedule,
            SOCIALS,
            DONATES,
            DAYHOURS,
            SEASONS,
            show1,
            show2,
            show3,
            showMixed,
            showAncient,
            showEmptyHours,
            showPixPopup,
            togglePixPopup,
            isSeedVisible,
            openurl,
            toggleFilter1,
            toggleFilter2,
            toggleFilter3,
            toggleFilterMixed,
            toggleFilterAncient,
            toggleFilterEmptyHours,
            copyPixToClipboard
        }
    }
}).use(vuetify).mount('#app');

