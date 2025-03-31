/**
 * Code to grab medals from Imgur Album: 
 * 
 * Array.from(document.querySelectorAll('img[src*="https://i.imgur.com"]')).map((elem) => elem.src)
 */

export const BATTLEFIELD_1 = {
    "VEHICLES": [],
    "CLASS": [],
    "WEAPONS": [],
    "GAMEMODE": [],
    "COMBAT": [],
    "SQUAD": []
}

export const BATTLEFIELD_3 = {
    "GENERAL": [],
    "WEAPONS AND BONUSES": [],
    "KITS": [],
    "VEHICLES": [],
    "PERFORMANCE": [],
    "OBJECTIVES": []
}

export const BATTLEFIELD_4 = {
    "KITS": [],
    "GAME MODE": [],
    "WEAPONS": [],
    "VEHICLES": [],
    "TEAM": [],
}

export const MEDALS_GAMES = {
    "BATTLEFIELD 1": {
        "MEDALS_ORDER": [
            "VEHICLES", 
            "CLASS", 
            "WEAPONS", 
            "GAMEMODE", 
            "COMBAT", 
            "SQUAD"
        ],
        "MEDALS_OBJ": BATTLEFIELD_1
    },
    "BATTLEFIELD 3": {
        "MEDALS_ORDER": [
            "GENERAL",
            "WEAPONS AND BONUSES",
            "KITS",
            "VEHICLES",
            "PERFORMANCE",
            "OBJECTIVES"
        ],
        "MEDALS_OBJ": BATTLEFIELD_3
    },
    "BATTLEFIELD 4": {
        "MEDALS_ORDER": [
            "KITS",
            "GAME MODE",
            "WEAPONS",
            "VEHICLES",
            "TEAM"
        ],
        "MEDALS_OBJ": BATTLEFIELD_4
    },
}