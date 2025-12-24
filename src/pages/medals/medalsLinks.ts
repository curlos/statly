/**
 * Code to grab all image srcs for the medals from an Imgur Album: 
 * Array.from(document.querySelectorAll('img[src*="https://i.imgur.com"]')).map((elem) => elem.src)
 */

import { fullArtPokemonCardImages } from "./fullArtPokemonCardImages";
import { googleSheetsPokemonCardImages } from "./googleSheetsPokemonCardImages";

export const BATTLEFIELD_1_MEDALS = {
    "VEHICLES": [
        "https://res.cloudinary.com/dvsuz3v37/image/upload/v1762007405/Statly/battlefield-1-medals/vehicles/1_qQZBT0J.webp",
        "https://res.cloudinary.com/dvsuz3v37/image/upload/v1762007405/Statly/battlefield-1-medals/vehicles/2_IiuUuoF.webp",
        "https://res.cloudinary.com/dvsuz3v37/image/upload/v1762007405/Statly/battlefield-1-medals/vehicles/3_ga2A0bK.webp",
        "https://res.cloudinary.com/dvsuz3v37/image/upload/v1762007405/Statly/battlefield-1-medals/vehicles/4_IhJADIe.webp",
        "https://res.cloudinary.com/dvsuz3v37/image/upload/v1762007405/Statly/battlefield-1-medals/vehicles/5_YZ42fan.webp",
        "https://res.cloudinary.com/dvsuz3v37/image/upload/v1762007406/Statly/battlefield-1-medals/vehicles/6_D3qhlhf.webp",
        "https://res.cloudinary.com/dvsuz3v37/image/upload/v1762007406/Statly/battlefield-1-medals/vehicles/7_eCfp6lZ.webp"
    ],
    "CLASS": [
        "https://res.cloudinary.com/dvsuz3v37/image/upload/v1762007406/Statly/battlefield-1-medals/class/8_rw0FgrZ.webp",
        "https://res.cloudinary.com/dvsuz3v37/image/upload/v1762007406/Statly/battlefield-1-medals/class/9_FwKHURW.webp",
        "https://res.cloudinary.com/dvsuz3v37/image/upload/v1762007406/Statly/battlefield-1-medals/class/10_C3WbKuH.webp",
        "https://res.cloudinary.com/dvsuz3v37/image/upload/v1762007660/Statly/battlefield-1-medals/class/11_xn8zhui.webp",
        "https://res.cloudinary.com/dvsuz3v37/image/upload/v1762007660/Statly/battlefield-1-medals/class/12_InNdpBV.webp",
        "https://res.cloudinary.com/dvsuz3v37/image/upload/v1762007660/Statly/battlefield-1-medals/class/13_2WLLZxc.webp",
        "https://res.cloudinary.com/dvsuz3v37/image/upload/v1762007660/Statly/battlefield-1-medals/class/14_gLYVuhz.webp",
        "https://res.cloudinary.com/dvsuz3v37/image/upload/v1762007660/Statly/battlefield-1-medals/class/15_bsTUyi5.webp",
        "https://res.cloudinary.com/dvsuz3v37/image/upload/v1762007661/Statly/battlefield-1-medals/class/16_vj3zQ9L.webp"
    ],
    "WEAPONS": [
        "https://res.cloudinary.com/dvsuz3v37/image/upload/v1762007661/Statly/battlefield-1-medals/weapons/17_rcsqD8g.webp",
        "https://res.cloudinary.com/dvsuz3v37/image/upload/v1762007661/Statly/battlefield-1-medals/weapons/18_z0TKXnH.webp",
        "https://res.cloudinary.com/dvsuz3v37/image/upload/v1762007661/Statly/battlefield-1-medals/weapons/19_rkGCc5j.webp",
        "https://res.cloudinary.com/dvsuz3v37/image/upload/v1762007661/Statly/battlefield-1-medals/weapons/20_j53CaLi.webp",
        "https://res.cloudinary.com/dvsuz3v37/image/upload/v1762007662/Statly/battlefield-1-medals/weapons/21_yc9s1oB.webp",
        "https://res.cloudinary.com/dvsuz3v37/image/upload/v1762007662/Statly/battlefield-1-medals/weapons/22_kZmyz6e.webp",
        "https://res.cloudinary.com/dvsuz3v37/image/upload/v1762007662/Statly/battlefield-1-medals/weapons/23_Bn2Tq2N.webp",
        "https://res.cloudinary.com/dvsuz3v37/image/upload/v1762007662/Statly/battlefield-1-medals/weapons/24_wVPztXW.webp",
        "https://res.cloudinary.com/dvsuz3v37/image/upload/v1762007662/Statly/battlefield-1-medals/weapons/25_FV3X7Nr.webp",
        "https://res.cloudinary.com/dvsuz3v37/image/upload/v1762007663/Statly/battlefield-1-medals/weapons/26_EGMF8j6.webp",
        "https://res.cloudinary.com/dvsuz3v37/image/upload/v1762007663/Statly/battlefield-1-medals/weapons/27_WMQQh47.webp",
        "https://res.cloudinary.com/dvsuz3v37/image/upload/v1762007663/Statly/battlefield-1-medals/weapons/28_5HFD732.webp"
    ],
    "GAMEMODE": [
        "https://res.cloudinary.com/dvsuz3v37/image/upload/v1762007663/Statly/battlefield-1-medals/gamemode/29_4Dn14jh.webp",
        "https://res.cloudinary.com/dvsuz3v37/image/upload/v1762007663/Statly/battlefield-1-medals/gamemode/30_Ep3Ufhd.webp",
        "https://res.cloudinary.com/dvsuz3v37/image/upload/v1762007664/Statly/battlefield-1-medals/gamemode/31_tjpI50K.webp",
        "https://res.cloudinary.com/dvsuz3v37/image/upload/v1762007664/Statly/battlefield-1-medals/gamemode/32_QcSga7n.webp",
        "https://res.cloudinary.com/dvsuz3v37/image/upload/v1762007664/Statly/battlefield-1-medals/gamemode/33_jPE8jF8.webp",
        "https://res.cloudinary.com/dvsuz3v37/image/upload/v1762007664/Statly/battlefield-1-medals/gamemode/34_nu2qMoP.webp",
        "https://res.cloudinary.com/dvsuz3v37/image/upload/v1762007664/Statly/battlefield-1-medals/gamemode/35_xAmMnml.webp",
        "https://res.cloudinary.com/dvsuz3v37/image/upload/v1762007665/Statly/battlefield-1-medals/gamemode/36_qvPOQYc.webp",
        "https://res.cloudinary.com/dvsuz3v37/image/upload/v1762007665/Statly/battlefield-1-medals/gamemode/37_YpbBJAd.webp",
        "https://res.cloudinary.com/dvsuz3v37/image/upload/v1762007665/Statly/battlefield-1-medals/gamemode/38_mbuNxpN.webp",
        "https://res.cloudinary.com/dvsuz3v37/image/upload/v1762007665/Statly/battlefield-1-medals/gamemode/39_TjSN655.webp",
        "https://res.cloudinary.com/dvsuz3v37/image/upload/v1762007665/Statly/battlefield-1-medals/gamemode/40_Y09YTx2.webp"
    ],
    "COMBAT": [
        "https://res.cloudinary.com/dvsuz3v37/image/upload/v1762007666/Statly/battlefield-1-medals/combat/41_YBX5t8r.webp",
        "https://res.cloudinary.com/dvsuz3v37/image/upload/v1762007666/Statly/battlefield-1-medals/combat/42_305hxZs.webp",
        "https://res.cloudinary.com/dvsuz3v37/image/upload/v1762007666/Statly/battlefield-1-medals/combat/43_67KRGxE.webp",
        "https://res.cloudinary.com/dvsuz3v37/image/upload/v1762007666/Statly/battlefield-1-medals/combat/44_ahjosIT.webp",
        "https://res.cloudinary.com/dvsuz3v37/image/upload/v1762007666/Statly/battlefield-1-medals/combat/45_43BejvD.webp",
        "https://res.cloudinary.com/dvsuz3v37/image/upload/v1762007666/Statly/battlefield-1-medals/combat/46_SQOm6nX.webp",
        "https://res.cloudinary.com/dvsuz3v37/image/upload/v1762007666/Statly/battlefield-1-medals/combat/47_zdvB60S.webp",
        "https://res.cloudinary.com/dvsuz3v37/image/upload/v1762007666/Statly/battlefield-1-medals/combat/48_iuWiC5Q.webp",
        "https://res.cloudinary.com/dvsuz3v37/image/upload/v1762007666/Statly/battlefield-1-medals/combat/49_dIvJYlX.webp",
        "https://res.cloudinary.com/dvsuz3v37/image/upload/v1762007666/Statly/battlefield-1-medals/combat/50_lyawN1p.webp",
        "https://res.cloudinary.com/dvsuz3v37/image/upload/v1762007765/Statly/battlefield-1-medals/combat/51_5ahcYAx.webp",
        "https://res.cloudinary.com/dvsuz3v37/image/upload/v1762007765/Statly/battlefield-1-medals/combat/52_tpWA4L7.webp",
        "https://res.cloudinary.com/dvsuz3v37/image/upload/v1762007765/Statly/battlefield-1-medals/combat/53_suPUG4M.webp",
        "https://res.cloudinary.com/dvsuz3v37/image/upload/v1762007765/Statly/battlefield-1-medals/combat/54_NdRr5Ol.webp",
        "https://res.cloudinary.com/dvsuz3v37/image/upload/v1762007765/Statly/battlefield-1-medals/combat/55_BJq6OgJ.webp",
        "https://res.cloudinary.com/dvsuz3v37/image/upload/v1762007766/Statly/battlefield-1-medals/combat/56_91AMzBS.webp"
    ],
    "SQUAD": [
        "https://res.cloudinary.com/dvsuz3v37/image/upload/v1762007766/Statly/battlefield-1-medals/squad/57_fuyMHRU.webp",
        "https://res.cloudinary.com/dvsuz3v37/image/upload/v1762007766/Statly/battlefield-1-medals/squad/58_4E9FHj4.webp",
        "https://res.cloudinary.com/dvsuz3v37/image/upload/v1762007766/Statly/battlefield-1-medals/squad/59_Cv3wZ12.webp",
        "https://res.cloudinary.com/dvsuz3v37/image/upload/v1762007766/Statly/battlefield-1-medals/squad/60_Zy36esq.webp"
    ]
}

export const BATTLEFIELD_1_RIBBONS = {
    "VEHICLE": [
        "https://res.cloudinary.com/dvsuz3v37/image/upload/v1762007766/Statly/battlefield-1-ribbons/vehicle/61_S68Fd6k.webp",
        "https://res.cloudinary.com/dvsuz3v37/image/upload/v1762007766/Statly/battlefield-1-ribbons/vehicle/62_vK8BNpG.webp",
        "https://res.cloudinary.com/dvsuz3v37/image/upload/v1762007766/Statly/battlefield-1-ribbons/vehicle/63_sjAzuRw.webp",
        "https://res.cloudinary.com/dvsuz3v37/image/upload/v1762007766/Statly/battlefield-1-ribbons/vehicle/64_a9cQYzV.webp"

    ],
    "CLASS": [
        "https://res.cloudinary.com/dvsuz3v37/image/upload/v1762007766/Statly/battlefield-1-ribbons/class/65_YuYQqBm.webp",
        "https://res.cloudinary.com/dvsuz3v37/image/upload/v1762007767/Statly/battlefield-1-ribbons/class/66_gsRNxO3.webp",
        "https://res.cloudinary.com/dvsuz3v37/image/upload/v1762007767/Statly/battlefield-1-ribbons/class/67_oReQ5Yq.webp",
        "https://res.cloudinary.com/dvsuz3v37/image/upload/v1762007767/Statly/battlefield-1-ribbons/class/68_41oda1F.webp",
        "https://res.cloudinary.com/dvsuz3v37/image/upload/v1762007767/Statly/battlefield-1-ribbons/class/69_ikhaqJz.webp",
        "https://res.cloudinary.com/dvsuz3v37/image/upload/v1762007767/Statly/battlefield-1-ribbons/class/70_u865JXP.webp",
        "https://res.cloudinary.com/dvsuz3v37/image/upload/v1762007767/Statly/battlefield-1-ribbons/class/71_Z3MKSlU.webp",
        "https://res.cloudinary.com/dvsuz3v37/image/upload/v1762007767/Statly/battlefield-1-ribbons/class/72_haSTeZP.webp",
        "https://res.cloudinary.com/dvsuz3v37/image/upload/v1762007767/Statly/battlefield-1-ribbons/class/73_L7PpF3z.webp"
    ],
    "WEAPON": [
        "https://res.cloudinary.com/dvsuz3v37/image/upload/v1762007767/Statly/battlefield-1-ribbons/weapon/74_eEVDpGg.webp",
        "https://res.cloudinary.com/dvsuz3v37/image/upload/v1762007767/Statly/battlefield-1-ribbons/weapon/75_jwClwi0.webp",
        "https://res.cloudinary.com/dvsuz3v37/image/upload/v1762007768/Statly/battlefield-1-ribbons/weapon/76_Egg3nct.webp",
        "https://res.cloudinary.com/dvsuz3v37/image/upload/v1762007768/Statly/battlefield-1-ribbons/weapon/77_4JLYt6R.webp",
        "https://res.cloudinary.com/dvsuz3v37/image/upload/v1762007768/Statly/battlefield-1-ribbons/weapon/78_pykrWZH.webp",
        "https://res.cloudinary.com/dvsuz3v37/image/upload/v1762007768/Statly/battlefield-1-ribbons/weapon/79_hIoYdeu.webp",
        "https://res.cloudinary.com/dvsuz3v37/image/upload/v1762007768/Statly/battlefield-1-ribbons/weapon/80_rLeBrvB.webp",
        "https://res.cloudinary.com/dvsuz3v37/image/upload/v1762007769/Statly/battlefield-1-ribbons/weapon/81_kwU5cPn.webp",
        "https://res.cloudinary.com/dvsuz3v37/image/upload/v1762007769/Statly/battlefield-1-ribbons/weapon/82_ME8KHAL.webp"
    ],
    "GAMEMODE": [
        "https://res.cloudinary.com/dvsuz3v37/image/upload/v1762007769/Statly/battlefield-1-ribbons/gamemode/83_7s9moKy.webp",
        "https://res.cloudinary.com/dvsuz3v37/image/upload/v1762007769/Statly/battlefield-1-ribbons/gamemode/84_B7bmHoE.webp",
        "https://res.cloudinary.com/dvsuz3v37/image/upload/v1762007769/Statly/battlefield-1-ribbons/gamemode/85_FBF3Mgy.webp",
        "https://res.cloudinary.com/dvsuz3v37/image/upload/v1762007770/Statly/battlefield-1-ribbons/gamemode/86_EUHQGBT.webp",
        "https://res.cloudinary.com/dvsuz3v37/image/upload/v1762007770/Statly/battlefield-1-ribbons/gamemode/87_AfXOBEE.webp",
        "https://res.cloudinary.com/dvsuz3v37/image/upload/v1762007770/Statly/battlefield-1-ribbons/gamemode/88_BiwS0YZ.webp",
        "https://res.cloudinary.com/dvsuz3v37/image/upload/v1762007770/Statly/battlefield-1-ribbons/gamemode/89_cfktKoO.webp"
    ],
    "COMBAT": [
        "https://res.cloudinary.com/dvsuz3v37/image/upload/v1762007770/Statly/battlefield-1-ribbons/combat/90_9VQ0O3D.webp",
        "https://res.cloudinary.com/dvsuz3v37/image/upload/v1762007771/Statly/battlefield-1-ribbons/combat/91_IRd0Sv7.webp",
        "https://res.cloudinary.com/dvsuz3v37/image/upload/v1762007771/Statly/battlefield-1-ribbons/combat/92_vb2zoOo.webp",
        "https://res.cloudinary.com/dvsuz3v37/image/upload/v1762007772/Statly/battlefield-1-ribbons/combat/93_2Jx5Icc.webp",
        "https://res.cloudinary.com/dvsuz3v37/image/upload/v1762007771/Statly/battlefield-1-ribbons/combat/94_fVlDKTn.webp",
        "https://res.cloudinary.com/dvsuz3v37/image/upload/v1762007771/Statly/battlefield-1-ribbons/combat/95_tlrLqwm.webp",
        "https://res.cloudinary.com/dvsuz3v37/image/upload/v1762007772/Statly/battlefield-1-ribbons/combat/96_JSUPvke.webp",
        "https://res.cloudinary.com/dvsuz3v37/image/upload/v1762007772/Statly/battlefield-1-ribbons/combat/97_OmQZOmN.webp",
        "https://res.cloudinary.com/dvsuz3v37/image/upload/v1762007772/Statly/battlefield-1-ribbons/combat/98_AzeEhmA.webp",
        "https://res.cloudinary.com/dvsuz3v37/image/upload/v1762007772/Statly/battlefield-1-ribbons/combat/99_JGunmJO.webp",
        "https://res.cloudinary.com/dvsuz3v37/image/upload/v1762007772/Statly/battlefield-1-ribbons/combat/100_5YZhZO0.webp",
        "https://res.cloudinary.com/dvsuz3v37/image/upload/v1762007773/Statly/battlefield-1-ribbons/combat/101_R0saODh.webp"
    ],
    "SQUAD": [
        "https://res.cloudinary.com/dvsuz3v37/image/upload/v1762007773/Statly/battlefield-1-ribbons/squad/102_fMaI8lr.webp",
        "https://res.cloudinary.com/dvsuz3v37/image/upload/v1762007773/Statly/battlefield-1-ribbons/squad/103_5ry5oa6.webp",
        "https://res.cloudinary.com/dvsuz3v37/image/upload/v1762007773/Statly/battlefield-1-ribbons/squad/104_nnKOLIr.webp",
        "https://res.cloudinary.com/dvsuz3v37/image/upload/v1762007773/Statly/battlefield-1-ribbons/squad/105_78qLs6J.webp"
    ]
}

export const BATTLEFIELD_3_MEDALS = {
    "GENERAL": [
        "https://res.cloudinary.com/dvsuz3v37/image/upload/v1762007774/Statly/battlefield-3-medals/general/106_KS9eJwz.webp",
        "https://res.cloudinary.com/dvsuz3v37/image/upload/v1762007774/Statly/battlefield-3-medals/general/107_PfFSgkI.webp"
    ],
    "WEAPONS AND BONUSES": [
        "https://res.cloudinary.com/dvsuz3v37/image/upload/v1762007774/Statly/battlefield-3-medals/weapons-and-bonuses/108_NoXlbVz.webp",
        "https://res.cloudinary.com/dvsuz3v37/image/upload/v1762007774/Statly/battlefield-3-medals/weapons-and-bonuses/109_cyknHe1.webp",
        "https://res.cloudinary.com/dvsuz3v37/image/upload/v1762007774/Statly/battlefield-3-medals/weapons-and-bonuses/110_zwhR0PW.webp",
        "https://res.cloudinary.com/dvsuz3v37/image/upload/v1762007775/Statly/battlefield-3-medals/weapons-and-bonuses/111_mZPau5n.webp",
        "https://res.cloudinary.com/dvsuz3v37/image/upload/v1762007775/Statly/battlefield-3-medals/weapons-and-bonuses/112_BzWRCpg.webp",
        "https://res.cloudinary.com/dvsuz3v37/image/upload/v1762007775/Statly/battlefield-3-medals/weapons-and-bonuses/113_EVqaeNa.webp",
        "https://res.cloudinary.com/dvsuz3v37/image/upload/v1762007775/Statly/battlefield-3-medals/weapons-and-bonuses/114_PooBB1m.webp",
        "https://res.cloudinary.com/dvsuz3v37/image/upload/v1762007775/Statly/battlefield-3-medals/weapons-and-bonuses/115_oHfzTfr.webp",
        "https://res.cloudinary.com/dvsuz3v37/image/upload/v1762007776/Statly/battlefield-3-medals/weapons-and-bonuses/116_ie8Ij5o.webp",
        "https://res.cloudinary.com/dvsuz3v37/image/upload/v1762007776/Statly/battlefield-3-medals/weapons-and-bonuses/117_l5FSrXd.webp",
        "https://res.cloudinary.com/dvsuz3v37/image/upload/v1762007776/Statly/battlefield-3-medals/weapons-and-bonuses/118_ZXF53bs.webp",
        "https://res.cloudinary.com/dvsuz3v37/image/upload/v1762007776/Statly/battlefield-3-medals/weapons-and-bonuses/119_di75Lvj.webp",
        "https://res.cloudinary.com/dvsuz3v37/image/upload/v1762007776/Statly/battlefield-3-medals/weapons-and-bonuses/120_sPHkIOf.webp",
        "https://res.cloudinary.com/dvsuz3v37/image/upload/v1762007777/Statly/battlefield-3-medals/weapons-and-bonuses/121_C056v5W.webp"
    ],
    "KITS": [
        "https://res.cloudinary.com/dvsuz3v37/image/upload/v1762007777/Statly/battlefield-3-medals/kits/122_6RT27ut.webp",
        "https://res.cloudinary.com/dvsuz3v37/image/upload/v1762007777/Statly/battlefield-3-medals/kits/123_Ws0v0vZ.webp",
        "https://res.cloudinary.com/dvsuz3v37/image/upload/v1762007777/Statly/battlefield-3-medals/kits/124_OqsOLBh.webp",
        "https://res.cloudinary.com/dvsuz3v37/image/upload/v1762007777/Statly/battlefield-3-medals/kits/125_8PTI0Zv.webp",
        "https://res.cloudinary.com/dvsuz3v37/image/upload/v1762007778/Statly/battlefield-3-medals/kits/126_p1q8D9L.webp",
        "https://res.cloudinary.com/dvsuz3v37/image/upload/v1762007778/Statly/battlefield-3-medals/kits/127_4JfGVal.webp",
        "https://res.cloudinary.com/dvsuz3v37/image/upload/v1762007778/Statly/battlefield-3-medals/kits/128_pZolpwr.webp",
        "https://res.cloudinary.com/dvsuz3v37/image/upload/v1762007778/Statly/battlefield-3-medals/kits/129_OrhmNvA.webp",
        "https://res.cloudinary.com/dvsuz3v37/image/upload/v1762007778/Statly/battlefield-3-medals/kits/130_yw1wD1E.webp",
        "https://res.cloudinary.com/dvsuz3v37/image/upload/v1762007779/Statly/battlefield-3-medals/kits/131_kWbbGjn.webp",
        "https://res.cloudinary.com/dvsuz3v37/image/upload/v1762007779/Statly/battlefield-3-medals/kits/132_C2ElXdt.webp",
        "https://res.cloudinary.com/dvsuz3v37/image/upload/v1762007779/Statly/battlefield-3-medals/kits/133_ESOl9vU.webp"
    ],
    "VEHICLES": [
        "https://res.cloudinary.com/dvsuz3v37/image/upload/v1762007779/Statly/battlefield-3-medals/vehicles/134_1aLL0dI.webp",
        "https://res.cloudinary.com/dvsuz3v37/image/upload/v1762007779/Statly/battlefield-3-medals/vehicles/135_1oAFhZw.webp",
        "https://res.cloudinary.com/dvsuz3v37/image/upload/v1762007780/Statly/battlefield-3-medals/vehicles/136_1q3pGFP.webp",
        "https://res.cloudinary.com/dvsuz3v37/image/upload/v1762007780/Statly/battlefield-3-medals/vehicles/137_nuVgrBY.webp",
        "https://res.cloudinary.com/dvsuz3v37/image/upload/v1762007780/Statly/battlefield-3-medals/vehicles/138_9BaAEeH.webp",
        "https://res.cloudinary.com/dvsuz3v37/image/upload/v1762007780/Statly/battlefield-3-medals/vehicles/139_XSTn7XI.webp",
        "https://res.cloudinary.com/dvsuz3v37/image/upload/v1762007780/Statly/battlefield-3-medals/vehicles/140_8sZA2Wl.webp",
        "https://res.cloudinary.com/dvsuz3v37/image/upload/v1762007781/Statly/battlefield-3-medals/vehicles/141_y8sADrZ.webp",
        "https://res.cloudinary.com/dvsuz3v37/image/upload/v1762007781/Statly/battlefield-3-medals/vehicles/142_v3m5BKL.webp"
    ],
    "PERFORMANCE": [
        "https://res.cloudinary.com/dvsuz3v37/image/upload/v1762007781/Statly/battlefield-3-medals/performance/143_fBrzBLB.webp",
        "https://res.cloudinary.com/dvsuz3v37/image/upload/v1762007781/Statly/battlefield-3-medals/performance/144_x2HWoyl.webp",
        "https://res.cloudinary.com/dvsuz3v37/image/upload/v1762007781/Statly/battlefield-3-medals/performance/145_tE4aXMN.webp",
        "https://res.cloudinary.com/dvsuz3v37/image/upload/v1762007782/Statly/battlefield-3-medals/performance/146_LB72elu.webp"
    ],
    "OBJECTIVES": [
        "https://res.cloudinary.com/dvsuz3v37/image/upload/v1762007782/Statly/battlefield-3-medals/objectives/147_1Wa8UmI.webp",
        "https://res.cloudinary.com/dvsuz3v37/image/upload/v1762007782/Statly/battlefield-3-medals/objectives/148_7yWuh9E.webp",
        "https://res.cloudinary.com/dvsuz3v37/image/upload/v1762007782/Statly/battlefield-3-medals/objectives/149_pMNOO7r.webp",
        "https://res.cloudinary.com/dvsuz3v37/image/upload/v1762007782/Statly/battlefield-3-medals/objectives/150_LVqOzyC.webp",
        "https://res.cloudinary.com/dvsuz3v37/image/upload/v1762007783/Statly/battlefield-3-medals/objectives/151_oKLQR2n.webp",
        "https://res.cloudinary.com/dvsuz3v37/image/upload/v1762007783/Statly/battlefield-3-medals/objectives/152_SSOqwhT.webp",
        "https://res.cloudinary.com/dvsuz3v37/image/upload/v1762007783/Statly/battlefield-3-medals/objectives/153_BVaIqWz.webp",
        "https://res.cloudinary.com/dvsuz3v37/image/upload/v1762007783/Statly/battlefield-3-medals/objectives/154_VfPiLj6.webp",
        "https://res.cloudinary.com/dvsuz3v37/image/upload/v1762007783/Statly/battlefield-3-medals/objectives/155_lKq6YaK.webp",
        "https://res.cloudinary.com/dvsuz3v37/image/upload/v1762007784/Statly/battlefield-3-medals/objectives/156_ifxfQfE.webp",
        "https://res.cloudinary.com/dvsuz3v37/image/upload/v1762007784/Statly/battlefield-3-medals/objectives/157_3lDLTmY.webp",
        "https://res.cloudinary.com/dvsuz3v37/image/upload/v1762007784/Statly/battlefield-3-medals/objectives/158_Cn0f7Br.webp",
        "https://res.cloudinary.com/dvsuz3v37/image/upload/v1762007784/Statly/battlefield-3-medals/objectives/159_66ShHOk.webp",
        "https://res.cloudinary.com/dvsuz3v37/image/upload/v1762007784/Statly/battlefield-3-medals/objectives/160_FfEaGLG.webp",
        "https://res.cloudinary.com/dvsuz3v37/image/upload/v1762007785/Statly/battlefield-3-medals/objectives/161_YCQDJZq.webp",
        "https://res.cloudinary.com/dvsuz3v37/image/upload/v1762007785/Statly/battlefield-3-medals/objectives/162_knmIfHd.webp"
    ]
}

export const BATTLEFIELD_3_RIBBONS = {
    "WEAPONS": [
        "https://res.cloudinary.com/dvsuz3v37/image/upload/v1762007785/Statly/battlefield-3-ribbons/weapons/163_whB6qO3.webp",
        "https://res.cloudinary.com/dvsuz3v37/image/upload/v1762007785/Statly/battlefield-3-ribbons/weapons/164_9BbwS23.webp",
        "https://res.cloudinary.com/dvsuz3v37/image/upload/v1762007785/Statly/battlefield-3-ribbons/weapons/165_qysOWt2.webp",
        "https://res.cloudinary.com/dvsuz3v37/image/upload/v1762007786/Statly/battlefield-3-ribbons/weapons/166_zWtNavj.webp",
        "https://res.cloudinary.com/dvsuz3v37/image/upload/v1762007786/Statly/battlefield-3-ribbons/weapons/167_1tV8lt6.webp",
        "https://res.cloudinary.com/dvsuz3v37/image/upload/v1762007786/Statly/battlefield-3-ribbons/weapons/168_yr9F9L1.webp",
        "https://res.cloudinary.com/dvsuz3v37/image/upload/v1762007786/Statly/battlefield-3-ribbons/weapons/169_XAeTF9E.webp",
        "https://res.cloudinary.com/dvsuz3v37/image/upload/v1762007786/Statly/battlefield-3-ribbons/weapons/170_5Q4DlZ4.webp"
    ],
    "STREAKS": [
        "https://res.cloudinary.com/dvsuz3v37/image/upload/v1762007787/Statly/battlefield-3-ribbons/streaks/171_fgMeZom.webp",
        "https://res.cloudinary.com/dvsuz3v37/image/upload/v1762007787/Statly/battlefield-3-ribbons/streaks/172_GT5xEc3.webp"
    ],
    "KITS": [
        "https://res.cloudinary.com/dvsuz3v37/image/upload/v1762007787/Statly/battlefield-3-ribbons/kits/173_6QdyWLz.webp",
        "https://res.cloudinary.com/dvsuz3v37/image/upload/v1762007787/Statly/battlefield-3-ribbons/kits/174_Ac9hjFj.webp",
        "https://res.cloudinary.com/dvsuz3v37/image/upload/v1762007787/Statly/battlefield-3-ribbons/kits/175_RQQaD75.webp",
        "https://res.cloudinary.com/dvsuz3v37/image/upload/v1762007788/Statly/battlefield-3-ribbons/kits/176_9rQBN27.webp"
    ],
    "VEHICLES": [
        "https://res.cloudinary.com/dvsuz3v37/image/upload/v1762007788/Statly/battlefield-3-ribbons/vehicles/177_q0MkYIq.webp",
        "https://res.cloudinary.com/dvsuz3v37/image/upload/v1762007788/Statly/battlefield-3-ribbons/vehicles/178_w2hH7g9.webp",
        "https://res.cloudinary.com/dvsuz3v37/image/upload/v1762007788/Statly/battlefield-3-ribbons/vehicles/179_9bl9ev1.webp",
        "https://res.cloudinary.com/dvsuz3v37/image/upload/v1762007788/Statly/battlefield-3-ribbons/vehicles/180_xe9Br1T.webp",
        "https://res.cloudinary.com/dvsuz3v37/image/upload/v1762007788/Statly/battlefield-3-ribbons/vehicles/181_Lk7izXE.webp",
        "https://res.cloudinary.com/dvsuz3v37/image/upload/v1762007788/Statly/battlefield-3-ribbons/vehicles/182_x8C3q63.webp",
        "https://res.cloudinary.com/dvsuz3v37/image/upload/v1762007788/Statly/battlefield-3-ribbons/vehicles/183_rjbU7FS.webp"
    ],
    "MVP": [
        "https://res.cloudinary.com/dvsuz3v37/image/upload/v1762007788/Statly/battlefield-3-ribbons/mvp/184_QRdsY4d.webp",
        "https://res.cloudinary.com/dvsuz3v37/image/upload/v1762007788/Statly/battlefield-3-ribbons/mvp/185_n4B45Nj.webp",
        "https://res.cloudinary.com/dvsuz3v37/image/upload/v1762007789/Statly/battlefield-3-ribbons/mvp/186_xB4j9W5.webp",
        "https://res.cloudinary.com/dvsuz3v37/image/upload/v1762007789/Statly/battlefield-3-ribbons/mvp/187_dddFk22.webp"
    ],
    "GAME MODES": [
        "https://res.cloudinary.com/dvsuz3v37/image/upload/v1762007789/Statly/battlefield-3-ribbons/game-modes/188_8X8QHVt.webp",
        "https://res.cloudinary.com/dvsuz3v37/image/upload/v1762007789/Statly/battlefield-3-ribbons/game-modes/189_AbVaKy3.webp",
        "https://res.cloudinary.com/dvsuz3v37/image/upload/v1762007789/Statly/battlefield-3-ribbons/game-modes/190_SmQIGu4.webp",
        "https://res.cloudinary.com/dvsuz3v37/image/upload/v1762007790/Statly/battlefield-3-ribbons/game-modes/191_5RGosrA.webp",
        "https://res.cloudinary.com/dvsuz3v37/image/upload/v1762007790/Statly/battlefield-3-ribbons/game-modes/192_sC5oGYN.webp",
        "https://res.cloudinary.com/dvsuz3v37/image/upload/v1762007790/Statly/battlefield-3-ribbons/game-modes/193_atVJuO5.webp",
        "https://res.cloudinary.com/dvsuz3v37/image/upload/v1762007790/Statly/battlefield-3-ribbons/game-modes/194_nTGNwGK.webp",
        "https://res.cloudinary.com/dvsuz3v37/image/upload/v1762007790/Statly/battlefield-3-ribbons/game-modes/195_ThAKmx2.webp",
        "https://res.cloudinary.com/dvsuz3v37/image/upload/v1762007791/Statly/battlefield-3-ribbons/game-modes/196_sGFdFZU.webp",
        "https://res.cloudinary.com/dvsuz3v37/image/upload/v1762007791/Statly/battlefield-3-ribbons/game-modes/197_GIb6UjU.webp",
        "https://res.cloudinary.com/dvsuz3v37/image/upload/v1762007791/Statly/battlefield-3-ribbons/game-modes/198_8FJ3kfj.webp",
        "https://res.cloudinary.com/dvsuz3v37/image/upload/v1762007791/Statly/battlefield-3-ribbons/game-modes/199_53bmvyR.webp",
        "https://res.cloudinary.com/dvsuz3v37/image/upload/v1762007791/Statly/battlefield-3-ribbons/game-modes/200_8oaGL69.webp",
        "https://res.cloudinary.com/dvsuz3v37/image/upload/v1762007792/Statly/battlefield-3-ribbons/game-modes/201_5Axxdvl.webp",
        "https://res.cloudinary.com/dvsuz3v37/image/upload/v1762007792/Statly/battlefield-3-ribbons/game-modes/202_eMBFjPk.webp",
        "https://res.cloudinary.com/dvsuz3v37/image/upload/v1762007792/Statly/battlefield-3-ribbons/game-modes/203_3Juh8Ho.webp"
    ],
    "GAME MODES (WINNER)": [
        "https://res.cloudinary.com/dvsuz3v37/image/upload/v1762007792/Statly/battlefield-3-ribbons/game-modes-winner-/204_Hrz5HDD.webp",
        "https://res.cloudinary.com/dvsuz3v37/image/upload/v1762007792/Statly/battlefield-3-ribbons/game-modes-winner-/205_O5uk15K.webp",
        "https://res.cloudinary.com/dvsuz3v37/image/upload/v1762007793/Statly/battlefield-3-ribbons/game-modes-winner-/206_KM5rkrW.webp",
        "https://res.cloudinary.com/dvsuz3v37/image/upload/v1762007793/Statly/battlefield-3-ribbons/game-modes-winner-/207_u6ddg3K.webp",
        "https://res.cloudinary.com/dvsuz3v37/image/upload/v1762007793/Statly/battlefield-3-ribbons/game-modes-winner-/208_iqdtrqn.webp",
        "https://res.cloudinary.com/dvsuz3v37/image/upload/v1762007793/Statly/battlefield-3-ribbons/game-modes-winner-/209_Ezi1NnF.webp",
        "https://res.cloudinary.com/dvsuz3v37/image/upload/v1762007793/Statly/battlefield-3-ribbons/game-modes-winner-/210_qVVOHBg.webp",
        "https://res.cloudinary.com/dvsuz3v37/image/upload/v1762007794/Statly/battlefield-3-ribbons/game-modes-winner-/211_jJrQ0r2.webp",
        "https://res.cloudinary.com/dvsuz3v37/image/upload/v1762007794/Statly/battlefield-3-ribbons/game-modes-winner-/212_CF3Jm3c.webp",
        "https://res.cloudinary.com/dvsuz3v37/image/upload/v1762007794/Statly/battlefield-3-ribbons/game-modes-winner-/213_ICUTxqE.webp",
        "https://res.cloudinary.com/dvsuz3v37/image/upload/v1762007794/Statly/battlefield-3-ribbons/game-modes-winner-/214_VTlGxTR.webp",
        "https://res.cloudinary.com/dvsuz3v37/image/upload/v1762007794/Statly/battlefield-3-ribbons/game-modes-winner-/215_27BqdKR.webp"
    ],
    "OTHER": [
        "https://res.cloudinary.com/dvsuz3v37/image/upload/v1762007795/Statly/battlefield-3-ribbons/other/216_UTkFGNm.webp",
        "https://res.cloudinary.com/dvsuz3v37/image/upload/v1762007795/Statly/battlefield-3-ribbons/other/217_2m7vw7y.webp",
        "https://res.cloudinary.com/dvsuz3v37/image/upload/v1762007795/Statly/battlefield-3-ribbons/other/218_bCFQUqm.webp",
        "https://res.cloudinary.com/dvsuz3v37/image/upload/v1762007795/Statly/battlefield-3-ribbons/other/219_t2KWlAJ.webp",
        "https://res.cloudinary.com/dvsuz3v37/image/upload/v1762007795/Statly/battlefield-3-ribbons/other/220_mksMhyy.webp",
        "https://res.cloudinary.com/dvsuz3v37/image/upload/v1762007795/Statly/battlefield-3-ribbons/other/221_4DyXUlL.webp",
        "https://res.cloudinary.com/dvsuz3v37/image/upload/v1762007795/Statly/battlefield-3-ribbons/other/222_VJcpZTu.webp"
    ],
}

export const BATTLEFIELD_4 = {
    "KITS": [
        "https://res.cloudinary.com/dvsuz3v37/image/upload/v1762007795/Statly/battlefield-4/kits/223_cPZdJHw.webp",
        "https://res.cloudinary.com/dvsuz3v37/image/upload/v1762007796/Statly/battlefield-4/kits/224_eqElC4b.webp",
        "https://res.cloudinary.com/dvsuz3v37/image/upload/v1762007795/Statly/battlefield-4/kits/225_EUZ3VtN.webp",
        "https://res.cloudinary.com/dvsuz3v37/image/upload/v1762007796/Statly/battlefield-4/kits/226_repxN9u.webp",
        "https://res.cloudinary.com/dvsuz3v37/image/upload/v1762007796/Statly/battlefield-4/kits/227_qkDt7Ng.webp",
        "https://res.cloudinary.com/dvsuz3v37/image/upload/v1762007796/Statly/battlefield-4/kits/228_Hnx4OPC.webp",
        "https://res.cloudinary.com/dvsuz3v37/image/upload/v1762007796/Statly/battlefield-4/kits/229_5EYPtgs.webp",
        "https://res.cloudinary.com/dvsuz3v37/image/upload/v1762007796/Statly/battlefield-4/kits/230_mjWZxbQ.webp",
        "https://res.cloudinary.com/dvsuz3v37/image/upload/v1762007797/Statly/battlefield-4/kits/231_x4AxY44.webp",
        "https://res.cloudinary.com/dvsuz3v37/image/upload/v1762007797/Statly/battlefield-4/kits/232_ANFKi5q.webp"
    ],
    "GAME MODE": [
        "https://res.cloudinary.com/dvsuz3v37/image/upload/v1762007797/Statly/battlefield-4/game-mode/233_xPFlgrS.webp",
        "https://res.cloudinary.com/dvsuz3v37/image/upload/v1762007797/Statly/battlefield-4/game-mode/234_XZpFonL.webp",
        "https://res.cloudinary.com/dvsuz3v37/image/upload/v1762007797/Statly/battlefield-4/game-mode/235_C3obhw9.webp",
        "https://res.cloudinary.com/dvsuz3v37/image/upload/v1762007798/Statly/battlefield-4/game-mode/236_6xdIkVR.webp",
        "https://res.cloudinary.com/dvsuz3v37/image/upload/v1762007798/Statly/battlefield-4/game-mode/237_Swztrga.webp",
        "https://res.cloudinary.com/dvsuz3v37/image/upload/v1762007798/Statly/battlefield-4/game-mode/238_kd2ilfO.webp",
        "https://res.cloudinary.com/dvsuz3v37/image/upload/v1762007798/Statly/battlefield-4/game-mode/239_mzckhKi.webp",
        "https://res.cloudinary.com/dvsuz3v37/image/upload/v1762007798/Statly/battlefield-4/game-mode/240_j149JWe.webp",
        "https://res.cloudinary.com/dvsuz3v37/image/upload/v1762007798/Statly/battlefield-4/game-mode/241_V2mLboC.webp",
        "https://res.cloudinary.com/dvsuz3v37/image/upload/v1762007798/Statly/battlefield-4/game-mode/242_NRmHG5K.webp",
        "https://res.cloudinary.com/dvsuz3v37/image/upload/v1762007799/Statly/battlefield-4/game-mode/243_fnJzmbh.webp",
        "https://res.cloudinary.com/dvsuz3v37/image/upload/v1762007798/Statly/battlefield-4/game-mode/244_epE6jCq.webp",
        "https://res.cloudinary.com/dvsuz3v37/image/upload/v1762007798/Statly/battlefield-4/game-mode/245_0pVerO5.webp",
        "https://res.cloudinary.com/dvsuz3v37/image/upload/v1762007799/Statly/battlefield-4/game-mode/246_X2LUj4l.webp",
        "https://res.cloudinary.com/dvsuz3v37/image/upload/v1762007799/Statly/battlefield-4/game-mode/247_RruTYo2.webp",
        "https://res.cloudinary.com/dvsuz3v37/image/upload/v1762007799/Statly/battlefield-4/game-mode/248_Bt26oRP.webp",
        "https://res.cloudinary.com/dvsuz3v37/image/upload/v1762007799/Statly/battlefield-4/game-mode/249_VSusJSN.webp"
    ],
    "WEAPONS": [
        "https://res.cloudinary.com/dvsuz3v37/image/upload/v1762007799/Statly/battlefield-4/weapons/250_4gswzm8.webp",
        "https://res.cloudinary.com/dvsuz3v37/image/upload/v1762007800/Statly/battlefield-4/weapons/251_ZN6cewF.webp",
        "https://res.cloudinary.com/dvsuz3v37/image/upload/v1762007800/Statly/battlefield-4/weapons/252_bUrFNXd.webp",
        "https://res.cloudinary.com/dvsuz3v37/image/upload/v1762007800/Statly/battlefield-4/weapons/253_OeKdtJJ.webp",
        "https://res.cloudinary.com/dvsuz3v37/image/upload/v1762007800/Statly/battlefield-4/weapons/254_sZohKA3.webp",
        "https://res.cloudinary.com/dvsuz3v37/image/upload/v1762007800/Statly/battlefield-4/weapons/255_ak1lr86.webp",
        "https://res.cloudinary.com/dvsuz3v37/image/upload/v1762007801/Statly/battlefield-4/weapons/256_LBwRyXN.webp",
        "https://res.cloudinary.com/dvsuz3v37/image/upload/v1762007801/Statly/battlefield-4/weapons/257_bP2cPmY.webp",
        "https://res.cloudinary.com/dvsuz3v37/image/upload/v1762007801/Statly/battlefield-4/weapons/258_AQsyQvB.webp",
        "https://res.cloudinary.com/dvsuz3v37/image/upload/v1762007801/Statly/battlefield-4/weapons/259_nrUorFo.webp"
    ],
    "VEHICLES": [
        "https://res.cloudinary.com/dvsuz3v37/image/upload/v1762007801/Statly/battlefield-4/vehicles/260_YtF2glJ.webp",
        "https://res.cloudinary.com/dvsuz3v37/image/upload/v1762007802/Statly/battlefield-4/vehicles/261_pOK3nHV.webp",
        "https://res.cloudinary.com/dvsuz3v37/image/upload/v1762007802/Statly/battlefield-4/vehicles/262_w6typ4u.webp",
        "https://res.cloudinary.com/dvsuz3v37/image/upload/v1762007802/Statly/battlefield-4/vehicles/263_P7gmZ1r.webp",
        "https://res.cloudinary.com/dvsuz3v37/image/upload/v1762007802/Statly/battlefield-4/vehicles/264_YpYy5Qv.webp",
        "https://res.cloudinary.com/dvsuz3v37/image/upload/v1762007802/Statly/battlefield-4/vehicles/265_0pGlPe0.webp",
        "https://res.cloudinary.com/dvsuz3v37/image/upload/v1762007804/Statly/battlefield-4/vehicles/266_7SFNmhI.webp",
        "https://res.cloudinary.com/dvsuz3v37/image/upload/v1762007804/Statly/battlefield-4/vehicles/267_7KdbsTt.webp"
    ],
    "TEAM": [
        "https://res.cloudinary.com/dvsuz3v37/image/upload/v1762007804/Statly/battlefield-4/team/268_uyzY22i.webp",
        "https://res.cloudinary.com/dvsuz3v37/image/upload/v1762007805/Statly/battlefield-4/team/269_ChzbLLh.webp",
        "https://res.cloudinary.com/dvsuz3v37/image/upload/v1762007805/Statly/battlefield-4/team/270_TJm3SFh.webp",
        "https://res.cloudinary.com/dvsuz3v37/image/upload/v1762007806/Statly/battlefield-4/team/271_NN4Eucc.webp",
        "https://res.cloudinary.com/dvsuz3v37/image/upload/v1762007806/Statly/battlefield-4/team/272_HM8lTZ5.webp",
        "https://res.cloudinary.com/dvsuz3v37/image/upload/v1762007806/Statly/battlefield-4/team/273_dndOd6j.webp",
        "https://res.cloudinary.com/dvsuz3v37/image/upload/v1762007806/Statly/battlefield-4/team/274_QFEyGdm.webp",
        "https://res.cloudinary.com/dvsuz3v37/image/upload/v1762007806/Statly/battlefield-4/team/275_MjB9Qme.webp",
        "https://res.cloudinary.com/dvsuz3v37/image/upload/v1762007806/Statly/battlefield-4/team/276_CMmjk77.webp"
    ],
}

export const BATTLEFIELD_4_RIBBONS = {
    "KITS": [
        "https://res.cloudinary.com/dvsuz3v37/image/upload/v1762007806/Statly/battlefield-4-ribbons/kits/277_G9Xt6Vm.webp",
        "https://res.cloudinary.com/dvsuz3v37/image/upload/v1762007806/Statly/battlefield-4-ribbons/kits/278_6yNiHam.webp",
        "https://res.cloudinary.com/dvsuz3v37/image/upload/v1762007806/Statly/battlefield-4-ribbons/kits/279_1jzxVnO.webp",
        "https://res.cloudinary.com/dvsuz3v37/image/upload/v1762007806/Statly/battlefield-4-ribbons/kits/280_kTMIz4M.webp"
    ],
    "GAME MODE": [
        "https://res.cloudinary.com/dvsuz3v37/image/upload/v1762007807/Statly/battlefield-4-ribbons/game-mode/281_iuP7mUd.webp",
        "https://res.cloudinary.com/dvsuz3v37/image/upload/v1762007807/Statly/battlefield-4-ribbons/game-mode/282_IKIYmtP.webp",
        "https://res.cloudinary.com/dvsuz3v37/image/upload/v1762007807/Statly/battlefield-4-ribbons/game-mode/283_BUua7oc.webp",
        "https://res.cloudinary.com/dvsuz3v37/image/upload/v1762007807/Statly/battlefield-4-ribbons/game-mode/284_UqAGmzp.webp",
        "https://res.cloudinary.com/dvsuz3v37/image/upload/v1762007808/Statly/battlefield-4-ribbons/game-mode/285_RtQKjd7.webp",
        "https://res.cloudinary.com/dvsuz3v37/image/upload/v1762007808/Statly/battlefield-4-ribbons/game-mode/286_wQaYCbA.webp",
        "https://res.cloudinary.com/dvsuz3v37/image/upload/v1762007808/Statly/battlefield-4-ribbons/game-mode/287_hSW3KVw.webp",
        "https://res.cloudinary.com/dvsuz3v37/image/upload/v1762007808/Statly/battlefield-4-ribbons/game-mode/288_VtbCs1K.webp",
        "https://res.cloudinary.com/dvsuz3v37/image/upload/v1762007808/Statly/battlefield-4-ribbons/game-mode/289_9ptZj8Z.webp",
        "https://res.cloudinary.com/dvsuz3v37/image/upload/v1762007808/Statly/battlefield-4-ribbons/game-mode/290_WNVsGwQ.webp",
        "https://res.cloudinary.com/dvsuz3v37/image/upload/v1762007809/Statly/battlefield-4-ribbons/game-mode/291_ABdE7rV.webp",
        "https://res.cloudinary.com/dvsuz3v37/image/upload/v1762007809/Statly/battlefield-4-ribbons/game-mode/292_0YjAfuC.webp",
        "https://res.cloudinary.com/dvsuz3v37/image/upload/v1762007809/Statly/battlefield-4-ribbons/game-mode/293_IrpPnDQ.webp",
        "https://res.cloudinary.com/dvsuz3v37/image/upload/v1762007809/Statly/battlefield-4-ribbons/game-mode/294_l9P7u6t.webp",
        "https://res.cloudinary.com/dvsuz3v37/image/upload/v1762007809/Statly/battlefield-4-ribbons/game-mode/295_kWQo1Dr.webp",
        "https://res.cloudinary.com/dvsuz3v37/image/upload/v1762007809/Statly/battlefield-4-ribbons/game-mode/296_fdKh5W3.webp",
        "https://res.cloudinary.com/dvsuz3v37/image/upload/v1762007809/Statly/battlefield-4-ribbons/game-mode/297_ntIJSwT.webp",
        "https://res.cloudinary.com/dvsuz3v37/image/upload/v1762007809/Statly/battlefield-4-ribbons/game-mode/298_dQ095CF.webp"
    ],
    "WEAPONS": [
        "https://res.cloudinary.com/dvsuz3v37/image/upload/v1762007809/Statly/battlefield-4-ribbons/weapons/299_VwK7HE4.webp",
        "https://res.cloudinary.com/dvsuz3v37/image/upload/v1762007809/Statly/battlefield-4-ribbons/weapons/300_fRjvcQI.webp",
        "https://res.cloudinary.com/dvsuz3v37/image/upload/v1762007810/Statly/battlefield-4-ribbons/weapons/301_t29jtp8.webp",
        "https://res.cloudinary.com/dvsuz3v37/image/upload/v1762007810/Statly/battlefield-4-ribbons/weapons/302_FK8HA9V.webp",
        "https://res.cloudinary.com/dvsuz3v37/image/upload/v1762007810/Statly/battlefield-4-ribbons/weapons/303_sfDOQh7.webp",
        "https://res.cloudinary.com/dvsuz3v37/image/upload/v1762007810/Statly/battlefield-4-ribbons/weapons/304_esEw4Xa.webp",
        "https://res.cloudinary.com/dvsuz3v37/image/upload/v1762007810/Statly/battlefield-4-ribbons/weapons/305_FoTyDFX.webp",
        "https://res.cloudinary.com/dvsuz3v37/image/upload/v1762007811/Statly/battlefield-4-ribbons/weapons/306_uIb51cM.webp",
        "https://res.cloudinary.com/dvsuz3v37/image/upload/v1762007811/Statly/battlefield-4-ribbons/weapons/307_SbUL6dJ.webp"
    ],
    "VEHICLES": [
        "https://res.cloudinary.com/dvsuz3v37/image/upload/v1762007811/Statly/battlefield-4-ribbons/vehicles/308_kjyCjoS.webp",
        "https://res.cloudinary.com/dvsuz3v37/image/upload/v1762007811/Statly/battlefield-4-ribbons/vehicles/309_RubEjS7.webp",
        "https://res.cloudinary.com/dvsuz3v37/image/upload/v1762007811/Statly/battlefield-4-ribbons/vehicles/310_x8uOSmV.webp",
        "https://res.cloudinary.com/dvsuz3v37/image/upload/v1762007814/Statly/battlefield-4-ribbons/vehicles/311_7i4OnH0.webp",
        "https://res.cloudinary.com/dvsuz3v37/image/upload/v1762007814/Statly/battlefield-4-ribbons/vehicles/312_fyiIjhW.webp",
        "https://res.cloudinary.com/dvsuz3v37/image/upload/v1762007814/Statly/battlefield-4-ribbons/vehicles/313_VKvb1p3.webp",
        "https://res.cloudinary.com/dvsuz3v37/image/upload/v1762007814/Statly/battlefield-4-ribbons/vehicles/314_VAQkbdS.webp",
        "https://res.cloudinary.com/dvsuz3v37/image/upload/v1762007814/Statly/battlefield-4-ribbons/vehicles/315_NP4cIcw.webp",
        "https://res.cloudinary.com/dvsuz3v37/image/upload/v1762007815/Statly/battlefield-4-ribbons/vehicles/316_UUOpzQV.webp"
    ],
    "TEAM": [
        "https://res.cloudinary.com/dvsuz3v37/image/upload/v1762007815/Statly/battlefield-4-ribbons/team/317_SaIjjlO.webp",
        "https://res.cloudinary.com/dvsuz3v37/image/upload/v1762007815/Statly/battlefield-4-ribbons/team/318_HjQybcd.webp",
        "https://res.cloudinary.com/dvsuz3v37/image/upload/v1762007815/Statly/battlefield-4-ribbons/team/319_fhF4l5f.webp",
        "https://res.cloudinary.com/dvsuz3v37/image/upload/v1762007815/Statly/battlefield-4-ribbons/team/320_XfkFIIp.webp",
        "https://res.cloudinary.com/dvsuz3v37/image/upload/v1762007816/Statly/battlefield-4-ribbons/team/321_WufDA2c.webp",
        "https://res.cloudinary.com/dvsuz3v37/image/upload/v1762007816/Statly/battlefield-4-ribbons/team/322_TAC2UTk.webp",
        "https://res.cloudinary.com/dvsuz3v37/image/upload/v1762007816/Statly/battlefield-4-ribbons/team/323_NF1gAef.webp",
        "https://res.cloudinary.com/dvsuz3v37/image/upload/v1762007816/Statly/battlefield-4-ribbons/team/324_q264Je8.webp",
        "https://res.cloudinary.com/dvsuz3v37/image/upload/v1762007816/Statly/battlefield-4-ribbons/team/325_LuPaw3G.webp",
        "https://res.cloudinary.com/dvsuz3v37/image/upload/v1762007817/Statly/battlefield-4-ribbons/team/326_nHGXnmT.webp",
        "https://res.cloudinary.com/dvsuz3v37/image/upload/v1762007817/Statly/battlefield-4-ribbons/team/327_IdJSLvx.webp",
        "https://res.cloudinary.com/dvsuz3v37/image/upload/v1762007817/Statly/battlefield-4-ribbons/team/328_FbfKxwG.webp",
        "https://res.cloudinary.com/dvsuz3v37/image/upload/v1762007817/Statly/battlefield-4-ribbons/team/329_DoC621M.webp",
        "https://res.cloudinary.com/dvsuz3v37/image/upload/v1762007817/Statly/battlefield-4-ribbons/team/330_TzT7Ek1.webp"
    ]
}

export const BATTLEFIELD_V_RIBBONS = {
    "STRATEGIC": [
        "https://res.cloudinary.com/dvsuz3v37/image/upload/v1762007818/Statly/battlefield-v-ribbons/strategic/331_20HosHl.webp",
        "https://res.cloudinary.com/dvsuz3v37/image/upload/v1762007818/Statly/battlefield-v-ribbons/strategic/332_cR31Qqm.webp",
        "https://res.cloudinary.com/dvsuz3v37/image/upload/v1762007818/Statly/battlefield-v-ribbons/strategic/333_25m6HpN.webp",
        "https://res.cloudinary.com/dvsuz3v37/image/upload/v1762007818/Statly/battlefield-v-ribbons/strategic/334_gULzLts.webp",
        "https://res.cloudinary.com/dvsuz3v37/image/upload/v1762007818/Statly/battlefield-v-ribbons/strategic/335_6TSu3WX.webp",
        "https://res.cloudinary.com/dvsuz3v37/image/upload/v1762007819/Statly/battlefield-v-ribbons/strategic/336_A44erkZ.webp",
        "https://res.cloudinary.com/dvsuz3v37/image/upload/v1762007819/Statly/battlefield-v-ribbons/strategic/337_KkqQTY2.webp",
        "https://res.cloudinary.com/dvsuz3v37/image/upload/v1762007819/Statly/battlefield-v-ribbons/strategic/338_xksitjz.webp",
        "https://res.cloudinary.com/dvsuz3v37/image/upload/v1762007819/Statly/battlefield-v-ribbons/strategic/339_tZZqPoz.webp"
    ],
    "COMBAT SERVICE": [
        "https://res.cloudinary.com/dvsuz3v37/image/upload/v1762007819/Statly/battlefield-v-ribbons/combat-service/340_01i6XSZ.webp",
        "https://res.cloudinary.com/dvsuz3v37/image/upload/v1762007819/Statly/battlefield-v-ribbons/combat-service/341_wmCaheC.webp",
        "https://res.cloudinary.com/dvsuz3v37/image/upload/v1762007819/Statly/battlefield-v-ribbons/combat-service/342_BlQAEeQ.webp",
        "https://res.cloudinary.com/dvsuz3v37/image/upload/v1762007819/Statly/battlefield-v-ribbons/combat-service/343_UTWGagE.webp",
        "https://res.cloudinary.com/dvsuz3v37/image/upload/v1762007819/Statly/battlefield-v-ribbons/combat-service/344_XagUBf2.webp",
        "https://res.cloudinary.com/dvsuz3v37/image/upload/v1762007819/Statly/battlefield-v-ribbons/combat-service/345_MIVCIvE.webp",
        "https://res.cloudinary.com/dvsuz3v37/image/upload/v1762007821/Statly/battlefield-v-ribbons/combat-service/346_SkkYxuf.webp",
        "https://res.cloudinary.com/dvsuz3v37/image/upload/v1762007821/Statly/battlefield-v-ribbons/combat-service/347_zc5FI9v.webp",
        "https://res.cloudinary.com/dvsuz3v37/image/upload/v1762007821/Statly/battlefield-v-ribbons/combat-service/348_brLpX3q.webp",
        "https://res.cloudinary.com/dvsuz3v37/image/upload/v1762007821/Statly/battlefield-v-ribbons/combat-service/349_PZgI4gT.webp"
    ],
    "TEAMWORK": [
        "https://res.cloudinary.com/dvsuz3v37/image/upload/v1762007821/Statly/battlefield-v-ribbons/teamwork/350_6k6zUCl.webp",
        "https://res.cloudinary.com/dvsuz3v37/image/upload/v1762007822/Statly/battlefield-v-ribbons/teamwork/351_HtHIPso.webp",
        "https://res.cloudinary.com/dvsuz3v37/image/upload/v1762007822/Statly/battlefield-v-ribbons/teamwork/352_r7oBM08.webp",
        "https://res.cloudinary.com/dvsuz3v37/image/upload/v1762007822/Statly/battlefield-v-ribbons/teamwork/353_mUT0BUk.webp",
        "https://res.cloudinary.com/dvsuz3v37/image/upload/v1762007822/Statly/battlefield-v-ribbons/teamwork/354_2Xv0f2Q.webp",
        "https://res.cloudinary.com/dvsuz3v37/image/upload/v1762007822/Statly/battlefield-v-ribbons/teamwork/355_yg51wcu.webp",
        "https://res.cloudinary.com/dvsuz3v37/image/upload/v1762007823/Statly/battlefield-v-ribbons/teamwork/356_xv9PEEA.webp"
    ]
}

export const BATTLEFIELD_HARDLINE_MEDALS = {
    "WEAPONS": [
        "https://res.cloudinary.com/dvsuz3v37/image/upload/v1762007823/Statly/battlefield-hardline-medals/weapons/357_7mWIOz1.webp",
        "https://res.cloudinary.com/dvsuz3v37/image/upload/v1762007823/Statly/battlefield-hardline-medals/weapons/358_BYHhV17.webp",
        "https://res.cloudinary.com/dvsuz3v37/image/upload/v1762007823/Statly/battlefield-hardline-medals/weapons/359_4LIFIHV.webp",
        "https://res.cloudinary.com/dvsuz3v37/image/upload/v1762007823/Statly/battlefield-hardline-medals/weapons/360_3z6gfm4.webp",
        "https://res.cloudinary.com/dvsuz3v37/image/upload/v1762007824/Statly/battlefield-hardline-medals/weapons/361_thEfX9S.webp",
        "https://res.cloudinary.com/dvsuz3v37/image/upload/v1762007824/Statly/battlefield-hardline-medals/weapons/362_XeSwkPH.webp",
        "https://res.cloudinary.com/dvsuz3v37/image/upload/v1762007824/Statly/battlefield-hardline-medals/weapons/363_5JLiWJk.webp",
        "https://res.cloudinary.com/dvsuz3v37/image/upload/v1762007824/Statly/battlefield-hardline-medals/weapons/364_sjiHbtG.webp",
        "https://res.cloudinary.com/dvsuz3v37/image/upload/v1762007824/Statly/battlefield-hardline-medals/weapons/365_UMfBGBR.webp"
    ],
    "VEHICLES": [
        "https://res.cloudinary.com/dvsuz3v37/image/upload/v1762007825/Statly/battlefield-hardline-medals/vehicles/366_OrB16Zf.webp",
        "https://res.cloudinary.com/dvsuz3v37/image/upload/v1762007825/Statly/battlefield-hardline-medals/vehicles/367_1E4jLDZ.webp",
        "https://res.cloudinary.com/dvsuz3v37/image/upload/v1762007825/Statly/battlefield-hardline-medals/vehicles/368_YBNLdHE.webp",
        "https://res.cloudinary.com/dvsuz3v37/image/upload/v1762007825/Statly/battlefield-hardline-medals/vehicles/369_IWs5U4L.webp",
        "https://res.cloudinary.com/dvsuz3v37/image/upload/v1762007825/Statly/battlefield-hardline-medals/vehicles/370_qWH91Ql.webp",
        "https://res.cloudinary.com/dvsuz3v37/image/upload/v1762007826/Statly/battlefield-hardline-medals/vehicles/371_8Gm08Tp.webp"
    ],
    "TEAM": [
        "https://res.cloudinary.com/dvsuz3v37/image/upload/v1762007826/Statly/battlefield-hardline-medals/team/372_OkY4ObO.webp",
        "https://res.cloudinary.com/dvsuz3v37/image/upload/v1762007826/Statly/battlefield-hardline-medals/team/373_SLLax4H.webp",
        "https://res.cloudinary.com/dvsuz3v37/image/upload/v1762007826/Statly/battlefield-hardline-medals/team/374_YJsxOyW.webp",
        "https://res.cloudinary.com/dvsuz3v37/image/upload/v1762007826/Statly/battlefield-hardline-medals/team/375_vkZr346.webp",
        "https://res.cloudinary.com/dvsuz3v37/image/upload/v1762007827/Statly/battlefield-hardline-medals/team/376_M5vNx38.webp",
        "https://res.cloudinary.com/dvsuz3v37/image/upload/v1762007827/Statly/battlefield-hardline-medals/team/377_0PeKzzk.webp"
    ],
    "ROBBERY": [
        "https://res.cloudinary.com/dvsuz3v37/image/upload/v1762007827/Statly/battlefield-hardline-medals/robbery/378_pQXKpjH.webp",
        "https://res.cloudinary.com/dvsuz3v37/image/upload/v1762007827/Statly/battlefield-hardline-medals/robbery/379_bGD6ku3.webp",
        "https://res.cloudinary.com/dvsuz3v37/image/upload/v1762007827/Statly/battlefield-hardline-medals/robbery/380_fBY7D27.webp",
        "https://res.cloudinary.com/dvsuz3v37/image/upload/v1762007828/Statly/battlefield-hardline-medals/robbery/381_ewSniHL.webp"
    ],
    "KITS": [
        "https://res.cloudinary.com/dvsuz3v37/image/upload/v1762007828/Statly/battlefield-hardline-medals/kits/382_a67ENfI.webp",
        "https://res.cloudinary.com/dvsuz3v37/image/upload/v1762007828/Statly/battlefield-hardline-medals/kits/383_ShOk7lE.webp",
        "https://res.cloudinary.com/dvsuz3v37/image/upload/v1762007828/Statly/battlefield-hardline-medals/kits/384_wi4Nbmx.webp",
        "https://res.cloudinary.com/dvsuz3v37/image/upload/v1762007828/Statly/battlefield-hardline-medals/kits/385_HKiSehH.webp",
        "https://res.cloudinary.com/dvsuz3v37/image/upload/v1762007829/Statly/battlefield-hardline-medals/kits/386_uYvWJMR.webp",
        "https://res.cloudinary.com/dvsuz3v37/image/upload/v1762007829/Statly/battlefield-hardline-medals/kits/387_PoMexw6.webp"
    ],
    "GETAWAY": [
        "https://res.cloudinary.com/dvsuz3v37/image/upload/v1762007829/Statly/battlefield-hardline-medals/getaway/388_h1K648U.webp",
        "https://res.cloudinary.com/dvsuz3v37/image/upload/v1762007829/Statly/battlefield-hardline-medals/getaway/389_Tivs9IN.webp",
        "https://res.cloudinary.com/dvsuz3v37/image/upload/v1762007829/Statly/battlefield-hardline-medals/getaway/390_jBTTc6m.webp"
    ],
    "GENERAL": [
        "https://res.cloudinary.com/dvsuz3v37/image/upload/v1762007831/Statly/battlefield-hardline-medals/general/391_5oep162.webp",
        "https://res.cloudinary.com/dvsuz3v37/image/upload/v1762007831/Statly/battlefield-hardline-medals/general/392_7j0oWwu.webp",
        "https://res.cloudinary.com/dvsuz3v37/image/upload/v1762007831/Statly/battlefield-hardline-medals/general/393_KdXcJtB.webp",
        "https://res.cloudinary.com/dvsuz3v37/image/upload/v1762007831/Statly/battlefield-hardline-medals/general/394_ZXEgXtZ.webp",
        "https://res.cloudinary.com/dvsuz3v37/image/upload/v1762007831/Statly/battlefield-hardline-medals/general/395_ZDU2AZt.webp",
        "https://res.cloudinary.com/dvsuz3v37/image/upload/v1762007833/Statly/battlefield-hardline-medals/general/396_Pi4kL4d.webp",
        "https://res.cloudinary.com/dvsuz3v37/image/upload/v1762007833/Statly/battlefield-hardline-medals/general/397_8E3Sl8Q.webp",
        "https://res.cloudinary.com/dvsuz3v37/image/upload/v1762007833/Statly/battlefield-hardline-medals/general/398_sUa8aBP.webp",
        "https://res.cloudinary.com/dvsuz3v37/image/upload/v1762007833/Statly/battlefield-hardline-medals/general/399_vAFSAby.webp",
        "https://res.cloudinary.com/dvsuz3v37/image/upload/v1762007833/Statly/battlefield-hardline-medals/general/400_tE58etV.webp",
        "https://res.cloudinary.com/dvsuz3v37/image/upload/v1762007834/Statly/battlefield-hardline-medals/general/401_ouZMuOB.webp",
        "https://res.cloudinary.com/dvsuz3v37/image/upload/v1762007834/Statly/battlefield-hardline-medals/general/402_LnJDeSV.webp",
        "https://res.cloudinary.com/dvsuz3v37/image/upload/v1762007834/Statly/battlefield-hardline-medals/general/403_Gr7zKOT.webp",
        "https://res.cloudinary.com/dvsuz3v37/image/upload/v1762007834/Statly/battlefield-hardline-medals/general/404_dItft3T.webp",
        "https://res.cloudinary.com/dvsuz3v37/image/upload/v1762007834/Statly/battlefield-hardline-medals/general/405_ryAnDMj.webp",
        "https://res.cloudinary.com/dvsuz3v37/image/upload/v1762007835/Statly/battlefield-hardline-medals/general/406_ZDhfGfB.webp",
        "https://res.cloudinary.com/dvsuz3v37/image/upload/v1762007835/Statly/battlefield-hardline-medals/general/407_3dVdwWA.webp"
    ],
    "GAME MODE": [
        "https://res.cloudinary.com/dvsuz3v37/image/upload/v1762007835/Statly/battlefield-hardline-medals/game-mode/408_jx2Zlh6.webp",
        "https://res.cloudinary.com/dvsuz3v37/image/upload/v1762007835/Statly/battlefield-hardline-medals/game-mode/409_O1CdmPj.webp",
        "https://res.cloudinary.com/dvsuz3v37/image/upload/v1762007835/Statly/battlefield-hardline-medals/game-mode/410_TYErWnw.webp",
        "https://res.cloudinary.com/dvsuz3v37/image/upload/v1762007836/Statly/battlefield-hardline-medals/game-mode/411_HxAA7T8.webp",
        "https://res.cloudinary.com/dvsuz3v37/image/upload/v1762007836/Statly/battlefield-hardline-medals/game-mode/412_bgGSCAY.webp",
        "https://res.cloudinary.com/dvsuz3v37/image/upload/v1762007836/Statly/battlefield-hardline-medals/game-mode/413_oZBamKT.webp",
        "https://res.cloudinary.com/dvsuz3v37/image/upload/v1762007836/Statly/battlefield-hardline-medals/game-mode/414_UuhAKYL.webp",
        "https://res.cloudinary.com/dvsuz3v37/image/upload/v1762007836/Statly/battlefield-hardline-medals/game-mode/415_yzWgpY4.webp",
        "https://res.cloudinary.com/dvsuz3v37/image/upload/v1762007837/Statly/battlefield-hardline-medals/game-mode/416_OOncoal.webp",
        "https://res.cloudinary.com/dvsuz3v37/image/upload/v1762007837/Statly/battlefield-hardline-medals/game-mode/417_ehLhSvZ.webp",
        "https://res.cloudinary.com/dvsuz3v37/image/upload/v1762007837/Statly/battlefield-hardline-medals/game-mode/418_Y1WvGqX.webp",
        "https://res.cloudinary.com/dvsuz3v37/image/upload/v1762007837/Statly/battlefield-hardline-medals/game-mode/419_rWEFLah.webp",
        "https://res.cloudinary.com/dvsuz3v37/image/upload/v1762007837/Statly/battlefield-hardline-medals/game-mode/420_JC0vaFY.webp",
        "https://res.cloudinary.com/dvsuz3v37/image/upload/v1762007838/Statly/battlefield-hardline-medals/game-mode/421_HOSIiG5.webp",
        "https://res.cloudinary.com/dvsuz3v37/image/upload/v1762007838/Statly/battlefield-hardline-medals/game-mode/422_4BpykdY.webp",
        "https://res.cloudinary.com/dvsuz3v37/image/upload/v1762007838/Statly/battlefield-hardline-medals/game-mode/423_okVlFpA.webp",
        "https://res.cloudinary.com/dvsuz3v37/image/upload/v1762007838/Statly/battlefield-hardline-medals/game-mode/424_pQklTMN.webp",
        "https://res.cloudinary.com/dvsuz3v37/image/upload/v1762007838/Statly/battlefield-hardline-medals/game-mode/425_UPlV8VW.webp",
        "https://res.cloudinary.com/dvsuz3v37/image/upload/v1762007838/Statly/battlefield-hardline-medals/game-mode/426_EE4gvRz.webp",
        "https://res.cloudinary.com/dvsuz3v37/image/upload/v1762007838/Statly/battlefield-hardline-medals/game-mode/427_LRAbPP3.webp",
        "https://res.cloudinary.com/dvsuz3v37/image/upload/v1762007838/Statly/battlefield-hardline-medals/game-mode/428_VI4Xkur.webp"
    ],
    "CRIMINAL ACTIVITY": [
        "https://res.cloudinary.com/dvsuz3v37/image/upload/v1762007838/Statly/battlefield-hardline-medals/criminal-activity/429_sfhWE0s.webp",
        "https://res.cloudinary.com/dvsuz3v37/image/upload/v1762007838/Statly/battlefield-hardline-medals/criminal-activity/430_b6KfsSM.webp",
        "https://res.cloudinary.com/dvsuz3v37/image/upload/v1762007839/Statly/battlefield-hardline-medals/criminal-activity/431_IiNOx2d.webp"
    ]
}

export const BLACK_OPS_2_CALLING_CARDS = {
    "GENERAL": [
        'https://res.cloudinary.com/dvsuz3v37/image/upload/v1762007839/Statly/black-ops-2-calling-cards/general/432_6xLKg5k.webp',
        'https://res.cloudinary.com/dvsuz3v37/image/upload/v1762007839/Statly/black-ops-2-calling-cards/general/433_1YgsWfs.webp',
        'https://res.cloudinary.com/dvsuz3v37/image/upload/v1762007839/Statly/black-ops-2-calling-cards/general/434_6XxU2gI.webp',
        'https://res.cloudinary.com/dvsuz3v37/image/upload/v1762007839/Statly/black-ops-2-calling-cards/general/435_bxbNsXn.webp',
        'https://res.cloudinary.com/dvsuz3v37/image/upload/v1762007840/Statly/black-ops-2-calling-cards/general/436_x084PtQ.webp',
        'https://res.cloudinary.com/dvsuz3v37/image/upload/v1762007840/Statly/black-ops-2-calling-cards/general/437_wB7IC8I.webp',
        'https://res.cloudinary.com/dvsuz3v37/image/upload/v1762007840/Statly/black-ops-2-calling-cards/general/438_RJwESL1.webp',
        'https://res.cloudinary.com/dvsuz3v37/image/upload/v1762007840/Statly/black-ops-2-calling-cards/general/439_jWwQMre.webp',
        'https://res.cloudinary.com/dvsuz3v37/image/upload/v1762007840/Statly/black-ops-2-calling-cards/general/440_H66q41n.webp',
        'https://res.cloudinary.com/dvsuz3v37/image/upload/v1762007840/Statly/black-ops-2-calling-cards/general/441_nVSAETq.webp',
        'https://res.cloudinary.com/dvsuz3v37/image/upload/v1762007840/Statly/black-ops-2-calling-cards/general/442_CHc4FZm.webp',
        'https://res.cloudinary.com/dvsuz3v37/image/upload/v1762007840/Statly/black-ops-2-calling-cards/general/443_C5XRDHf.webp',
        'https://res.cloudinary.com/dvsuz3v37/image/upload/v1762007840/Statly/black-ops-2-calling-cards/general/444_NqLXU5k.webp',
        'https://res.cloudinary.com/dvsuz3v37/image/upload/v1762007841/Statly/black-ops-2-calling-cards/general/445_mjQR03J.webp',
        'https://res.cloudinary.com/dvsuz3v37/image/upload/v1762007842/Statly/black-ops-2-calling-cards/general/446_QPGlCRU.webp',
        'https://res.cloudinary.com/dvsuz3v37/image/upload/v1762007842/Statly/black-ops-2-calling-cards/general/447_JF5yqRY.webp',
        'https://res.cloudinary.com/dvsuz3v37/image/upload/v1762007842/Statly/black-ops-2-calling-cards/general/448_xgI5YX3.webp',
        'https://res.cloudinary.com/dvsuz3v37/image/upload/v1762007842/Statly/black-ops-2-calling-cards/general/449_ta2Mntd.webp',
        'https://res.cloudinary.com/dvsuz3v37/image/upload/v1762007842/Statly/black-ops-2-calling-cards/general/450_uynvJZh.webp',
        'https://res.cloudinary.com/dvsuz3v37/image/upload/v1762007842/Statly/black-ops-2-calling-cards/general/451_nmgjNAy.webp',
        'https://res.cloudinary.com/dvsuz3v37/image/upload/v1762007843/Statly/black-ops-2-calling-cards/general/452_iy2ZSMF.webp',
        'https://res.cloudinary.com/dvsuz3v37/image/upload/v1762007842/Statly/black-ops-2-calling-cards/general/453_TAhBlMG.webp',
        'https://res.cloudinary.com/dvsuz3v37/image/upload/v1762007843/Statly/black-ops-2-calling-cards/general/454_crfh1D3.webp',
        'https://res.cloudinary.com/dvsuz3v37/image/upload/v1762007842/Statly/black-ops-2-calling-cards/general/455_NUw06Bt.webp',
    ]
}

export const BLACK_OPS_2_KILLSTREAK_MEDALS = {
    "KILLSTREAKS": [
        "https://res.cloudinary.com/dvsuz3v37/image/upload/v1762007843/Statly/black-ops-2-killstreak-medals/killstreaks/456_59UYHck.webp",
        "https://res.cloudinary.com/dvsuz3v37/image/upload/v1762007843/Statly/black-ops-2-killstreak-medals/killstreaks/457_hsZCur7.webp",
        "https://res.cloudinary.com/dvsuz3v37/image/upload/v1762007843/Statly/black-ops-2-killstreak-medals/killstreaks/458_H5znivp.webp",
        "https://res.cloudinary.com/dvsuz3v37/image/upload/v1762007843/Statly/black-ops-2-killstreak-medals/killstreaks/459_AcWOa0g.webp",
        "https://res.cloudinary.com/dvsuz3v37/image/upload/v1762007843/Statly/black-ops-2-killstreak-medals/killstreaks/460_tFa0En4.webp",
        "https://res.cloudinary.com/dvsuz3v37/image/upload/v1762007844/Statly/black-ops-2-killstreak-medals/killstreaks/461_q3kMqll.webp",
        "https://res.cloudinary.com/dvsuz3v37/image/upload/v1762007844/Statly/black-ops-2-killstreak-medals/killstreaks/462_VDC3XrD.webp",
        "https://res.cloudinary.com/dvsuz3v37/image/upload/v1762007844/Statly/black-ops-2-killstreak-medals/killstreaks/463_hFmnedG.webp",
        "https://res.cloudinary.com/dvsuz3v37/image/upload/v1762007844/Statly/black-ops-2-killstreak-medals/killstreaks/464_G4oUON1.webp",
        "https://res.cloudinary.com/dvsuz3v37/image/upload/v1762007844/Statly/black-ops-2-killstreak-medals/killstreaks/465_5TYWJTz.webp",
        "https://res.cloudinary.com/dvsuz3v37/image/upload/v1762007844/Statly/black-ops-2-killstreak-medals/killstreaks/466_fbXVfEu.webp",
        "https://res.cloudinary.com/dvsuz3v37/image/upload/v1762007844/Statly/black-ops-2-killstreak-medals/killstreaks/467_W51APJx.webp",
        "https://res.cloudinary.com/dvsuz3v37/image/upload/v1762007844/Statly/black-ops-2-killstreak-medals/killstreaks/468_306twd2.webp"
    ]
}

export const ACE_COMBAT_7_MEDALS = {
    "CAMPAIGN": [
        "https://res.cloudinary.com/dvsuz3v37/image/upload/v1762007844/Statly/ace-combat-7-medals/campaign/469_s2OrFQl.webp",
        "https://res.cloudinary.com/dvsuz3v37/image/upload/v1762007844/Statly/ace-combat-7-medals/campaign/470_7kY8X9H.webp",
        "https://res.cloudinary.com/dvsuz3v37/image/upload/v1762007845/Statly/ace-combat-7-medals/campaign/471_34r81Zn.webp",
        "https://res.cloudinary.com/dvsuz3v37/image/upload/v1762007845/Statly/ace-combat-7-medals/campaign/472_th5uiX6.webp",
        "https://res.cloudinary.com/dvsuz3v37/image/upload/v1762007845/Statly/ace-combat-7-medals/campaign/473_kat2il9.webp",
        "https://res.cloudinary.com/dvsuz3v37/image/upload/v1762007845/Statly/ace-combat-7-medals/campaign/474_l2Qtvsu.webp",
        "https://res.cloudinary.com/dvsuz3v37/image/upload/v1762007845/Statly/ace-combat-7-medals/campaign/475_xlzRPMq.webp",
        "https://res.cloudinary.com/dvsuz3v37/image/upload/v1762007846/Statly/ace-combat-7-medals/campaign/476_u65Wm4q.webp",
        "https://res.cloudinary.com/dvsuz3v37/image/upload/v1762007846/Statly/ace-combat-7-medals/campaign/477_6ZJemOf.webp",
        "https://res.cloudinary.com/dvsuz3v37/image/upload/v1762007846/Statly/ace-combat-7-medals/campaign/478_4IHAFaC.webp",
        "https://res.cloudinary.com/dvsuz3v37/image/upload/v1762007846/Statly/ace-combat-7-medals/campaign/479_SJAQOGn.webp",
        "https://res.cloudinary.com/dvsuz3v37/image/upload/v1762007846/Statly/ace-combat-7-medals/campaign/480_QDr4nGG.webp",
        "https://res.cloudinary.com/dvsuz3v37/image/upload/v1762007847/Statly/ace-combat-7-medals/campaign/481_sRrSUEv.webp",
        "https://res.cloudinary.com/dvsuz3v37/image/upload/v1762007847/Statly/ace-combat-7-medals/campaign/482_EWFj18m.webp",
        "https://res.cloudinary.com/dvsuz3v37/image/upload/v1762007847/Statly/ace-combat-7-medals/campaign/483_0jLOFcW.webp",
        "https://res.cloudinary.com/dvsuz3v37/image/upload/v1762007847/Statly/ace-combat-7-medals/campaign/484_zT7g3pc.webp",
        "https://res.cloudinary.com/dvsuz3v37/image/upload/v1762007847/Statly/ace-combat-7-medals/campaign/485_3eDQ0W1.webp",
        "https://res.cloudinary.com/dvsuz3v37/image/upload/v1762007848/Statly/ace-combat-7-medals/campaign/486_iNr7eY9.webp"
    ],
    "VR MODE": [
        "https://res.cloudinary.com/dvsuz3v37/image/upload/v1762007848/Statly/ace-combat-7-medals/vr-mode/487_qoTa4o3.webp",
        "https://res.cloudinary.com/dvsuz3v37/image/upload/v1762007848/Statly/ace-combat-7-medals/vr-mode/488_0u9Dlkq.webp",
        "https://res.cloudinary.com/dvsuz3v37/image/upload/v1762007848/Statly/ace-combat-7-medals/vr-mode/489_vGQpAc4.webp",
        "https://res.cloudinary.com/dvsuz3v37/image/upload/v1762007848/Statly/ace-combat-7-medals/vr-mode/490_WaCM13J.webp",
        "https://res.cloudinary.com/dvsuz3v37/image/upload/v1762007849/Statly/ace-combat-7-medals/vr-mode/491_ItD3dZD.webp",
        "https://res.cloudinary.com/dvsuz3v37/image/upload/v1762007849/Statly/ace-combat-7-medals/vr-mode/492_frhUy0r.webp",
        "https://res.cloudinary.com/dvsuz3v37/image/upload/v1762007849/Statly/ace-combat-7-medals/vr-mode/493_K5YJNvE.webp",
        "https://res.cloudinary.com/dvsuz3v37/image/upload/v1762007849/Statly/ace-combat-7-medals/vr-mode/494_vliIpaN.webp",
        "https://res.cloudinary.com/dvsuz3v37/image/upload/v1762007849/Statly/ace-combat-7-medals/vr-mode/495_quF5aPe.webp",
        "https://res.cloudinary.com/dvsuz3v37/image/upload/v1762007850/Statly/ace-combat-7-medals/vr-mode/496_eLDzVLF.webp"
    ],
    "MULTIPLAYER": [
        "https://res.cloudinary.com/dvsuz3v37/image/upload/v1762007850/Statly/ace-combat-7-medals/multiplayer/497_4YwMZLO.webp",
        "https://res.cloudinary.com/dvsuz3v37/image/upload/v1762007850/Statly/ace-combat-7-medals/multiplayer/498_ztL1gWu.webp",
        "https://res.cloudinary.com/dvsuz3v37/image/upload/v1762007850/Statly/ace-combat-7-medals/multiplayer/499_RR3xpkP.webp",
        "https://res.cloudinary.com/dvsuz3v37/image/upload/v1762007850/Statly/ace-combat-7-medals/multiplayer/500_w90mhMd.webp",
        "https://res.cloudinary.com/dvsuz3v37/image/upload/v1762007851/Statly/ace-combat-7-medals/multiplayer/501_wcbQR9g.webp",
        "https://res.cloudinary.com/dvsuz3v37/image/upload/v1762007851/Statly/ace-combat-7-medals/multiplayer/502_IT2WbUU.webp",
        "https://res.cloudinary.com/dvsuz3v37/image/upload/v1762007851/Statly/ace-combat-7-medals/multiplayer/503_4ZG5l0m.webp",
        "https://res.cloudinary.com/dvsuz3v37/image/upload/v1762007851/Statly/ace-combat-7-medals/multiplayer/504_e2G9YH8.webp"
    ],
}

export const MW2019_WEAPON_CAMOS = {
    "SPRAY PAINT": [
        "https://res.cloudinary.com/dvsuz3v37/image/upload/v1766609478/Statly/mw2019-weapon-camos/SPRAY%20PAINT/Desert_Snake_Camo_Icon_MW2019.webp",
        "https://res.cloudinary.com/dvsuz3v37/image/upload/v1766609478/Statly/mw2019-weapon-camos/SPRAY%20PAINT/Commando_Camo_Icon_MW2019.webp",
        "https://res.cloudinary.com/dvsuz3v37/image/upload/v1766609478/Statly/mw2019-weapon-camos/SPRAY%20PAINT/Rip_N%2527Tear_Camo_Icon_MW2019.webp",
        "https://res.cloudinary.com/dvsuz3v37/image/upload/v1766609477/Statly/mw2019-weapon-camos/SPRAY%20PAINT/Moroccan_Snake_Camo_Icon_MW2019.webp",
        "https://res.cloudinary.com/dvsuz3v37/image/upload/v1766609479/Statly/mw2019-weapon-camos/SPRAY%20PAINT/Pitter_Patter_Camo_Icon_MW2019.webp",
        "https://res.cloudinary.com/dvsuz3v37/image/upload/v1766609478/Statly/mw2019-weapon-camos/SPRAY%20PAINT/China_Lake_Camo_Icon_MW2019.webp",
        "https://res.cloudinary.com/dvsuz3v37/image/upload/v1766609478/Statly/mw2019-weapon-camos/SPRAY%20PAINT/Pinstripe_Suit_Camo_Icon_MW2019.webp",
        "https://res.cloudinary.com/dvsuz3v37/image/upload/v1766609476/Statly/mw2019-weapon-camos/SPRAY%20PAINT/Chain_Link_Camo_Icon_MW2019.webp",
        "https://res.cloudinary.com/dvsuz3v37/image/upload/v1766609478/Statly/mw2019-weapon-camos/SPRAY%20PAINT/Nightfall_Camo_Icon_MW2019.webp",
        "https://res.cloudinary.com/dvsuz3v37/image/upload/v1766609478/Statly/mw2019-weapon-camos/SPRAY%20PAINT/Smoke_Camo_Icon_MW2019.webp",
    ],
    "WOODLAND": [
        "https://res.cloudinary.com/dvsuz3v37/image/upload/v1766609488/Statly/mw2019-weapon-camos/WOODLAND/Swamp_Camo_Icon_MW2019.webp",
        "https://res.cloudinary.com/dvsuz3v37/image/upload/v1766609487/Statly/mw2019-weapon-camos/WOODLAND/Modern_Woodland_Camo_Icon_MW2019.webp",
        "https://res.cloudinary.com/dvsuz3v37/image/upload/v1766609487/Statly/mw2019-weapon-camos/WOODLAND/Desert_Hybrid_Camo_Icon_MW2019.webp",
        "https://res.cloudinary.com/dvsuz3v37/image/upload/v1766609488/Statly/mw2019-weapon-camos/WOODLAND/Sand_Dance_Camo_Icon_MW2019.webp",
        "https://res.cloudinary.com/dvsuz3v37/image/upload/v1766609487/Statly/mw2019-weapon-camos/WOODLAND/Marshland_Camo_Icon_MW2019.webp",
        "https://res.cloudinary.com/dvsuz3v37/image/upload/v1766609487/Statly/mw2019-weapon-camos/WOODLAND/Kill_Brush_Camo_Icon_MW2019.webp",
        "https://res.cloudinary.com/dvsuz3v37/image/upload/v1766609488/Statly/mw2019-weapon-camos/WOODLAND/WARCOM_Greens_Camo_Icon_MW2019.webp",
        "https://res.cloudinary.com/dvsuz3v37/image/upload/v1766609488/Statly/mw2019-weapon-camos/WOODLAND/WARCOM_Blues_Camo_Icon_MW2019.webp",
        "https://res.cloudinary.com/dvsuz3v37/image/upload/v1766609487/Statly/mw2019-weapon-camos/WOODLAND/Nightfrost_Camo_Icon_MW2019.webp",
        "https://res.cloudinary.com/dvsuz3v37/image/upload/v1766609486/Statly/mw2019-weapon-camos/WOODLAND/Canopy_Camo_Icon_MW2019.webp"
    ],
    "DIGITAL": [
        "https://res.cloudinary.com/dvsuz3v37/image/upload/v1766609465/Statly/mw2019-weapon-camos/DIGITAL/Urban_Digital_Camo_Icon_MW2019.webp",
        "https://res.cloudinary.com/dvsuz3v37/image/upload/v1766609465/Statly/mw2019-weapon-camos/DIGITAL/Jungle_Digital_Camo_Icon_MW2019.webp",
        "https://res.cloudinary.com/dvsuz3v37/image/upload/v1766609435/Statly/mw2019-weapon-camos/DIGITAL/Arctic_Digital_Camo_Icon_MW2019.webp",
        "https://res.cloudinary.com/dvsuz3v37/image/upload/v1766609436/Statly/mw2019-weapon-camos/DIGITAL/Forest_Digital_Camo_Icon_MW2019.webp",
        "https://res.cloudinary.com/dvsuz3v37/image/upload/v1766609465/Statly/mw2019-weapon-camos/DIGITAL/Marsh_Digital_Camo_Icon_MW2019.webp",
        "https://res.cloudinary.com/dvsuz3v37/image/upload/v1766609436/Statly/mw2019-weapon-camos/DIGITAL/Bark_Digital_Camo_Icon_MW2019.webp",
        "https://res.cloudinary.com/dvsuz3v37/image/upload/v1766609436/Statly/mw2019-weapon-camos/DIGITAL/Blue_Digital_Camo_Icon_MW2019.webp",
        "https://res.cloudinary.com/dvsuz3v37/image/upload/v1766609436/Statly/mw2019-weapon-camos/DIGITAL/Classic_Digital_Camo_Icon_MW2019.webp",
        "https://res.cloudinary.com/dvsuz3v37/image/upload/v1766609437/Statly/mw2019-weapon-camos/DIGITAL/Desert_Digital_Camo_Icon_MW2019.webp",
        "https://res.cloudinary.com/dvsuz3v37/image/upload/v1766609465/Statly/mw2019-weapon-camos/DIGITAL/Green_Digital_Camo_Icon_MW2019.webp",
    ],
    "DRAGON": [
        "https://res.cloudinary.com/dvsuz3v37/image/upload/v1766609466/Statly/mw2019-weapon-camos/DRAGON/H20_Camo_Icon_MW2019.webp",
        "https://res.cloudinary.com/dvsuz3v37/image/upload/v1766609466/Statly/mw2019-weapon-camos/DRAGON/Dirt_Camo_Icon_MW2019.webp",
        "https://res.cloudinary.com/dvsuz3v37/image/upload/v1766609467/Statly/mw2019-weapon-camos/DRAGON/Moss_Camo_Icon_MW2019.webp",
        "https://res.cloudinary.com/dvsuz3v37/image/upload/v1766609467/Statly/mw2019-weapon-camos/DRAGON/Tagged_Camo_Icon_MW2019.webp",
        "https://res.cloudinary.com/dvsuz3v37/image/upload/v1766609466/Statly/mw2019-weapon-camos/DRAGON/Black_Top_Camo_Icon_MW2019.webp",
        "https://res.cloudinary.com/dvsuz3v37/image/upload/v1766609465/Statly/mw2019-weapon-camos/DRAGON/Asphalt_Camo_Icon_MW2019.webp",
        "https://res.cloudinary.com/dvsuz3v37/image/upload/v1766609466/Statly/mw2019-weapon-camos/DRAGON/Crime_Scene_Camo_Icon_MW2019.webp",
        "https://res.cloudinary.com/dvsuz3v37/image/upload/v1766609468/Statly/mw2019-weapon-camos/DRAGON/Neon_Pink_Camo_Icon_MW2019.webp",
        "https://res.cloudinary.com/dvsuz3v37/image/upload/v1766609468/Statly/mw2019-weapon-camos/DRAGON/Trailblazer_Camo_Icon_MW2019.webp",
        "https://res.cloudinary.com/dvsuz3v37/image/upload/v1766609466/Statly/mw2019-weapon-camos/DRAGON/Foliage_Camo_Icon_MW2019.webp"
    ],
    "SPLINTER": [
        "https://res.cloudinary.com/dvsuz3v37/image/upload/v1766609476/Statly/mw2019-weapon-camos/SPLINTER/Tundra_Camo_Icon_MW2019.webp",
        "https://res.cloudinary.com/dvsuz3v37/image/upload/v1766609476/Statly/mw2019-weapon-camos/SPLINTER/Undergrowth_Camo_Icon_MW2019.webp",
        "https://res.cloudinary.com/dvsuz3v37/image/upload/v1766609475/Statly/mw2019-weapon-camos/SPLINTER/Frostbite_Camo_Icon_MW2019.webp",
        "https://res.cloudinary.com/dvsuz3v37/image/upload/v1766609475/Statly/mw2019-weapon-camos/SPLINTER/Ice_Breaker_Camo_Icon_MW2019.webp",
        "https://res.cloudinary.com/dvsuz3v37/image/upload/v1766609476/Statly/mw2019-weapon-camos/SPLINTER/Ruins_Camo_Icon_MW2019.webp",
        "https://res.cloudinary.com/dvsuz3v37/image/upload/v1766609475/Statly/mw2019-weapon-camos/SPLINTER/Arctic_Seafoam_Camo_Icon_MW2019.webp",
        "https://res.cloudinary.com/dvsuz3v37/image/upload/v1766609474/Statly/mw2019-weapon-camos/SPLINTER/Angles_Camo_Icon_MW2019.webp",
        "https://res.cloudinary.com/dvsuz3v37/image/upload/v1766609475/Statly/mw2019-weapon-camos/SPLINTER/Autumn_Dazzle_Camo_Icon_MW2019.webp",
        "https://res.cloudinary.com/dvsuz3v37/image/upload/v1766609475/Statly/mw2019-weapon-camos/SPLINTER/Arctic_Abstract_Camo_Icon_MW2019.webp",
        "https://res.cloudinary.com/dvsuz3v37/image/upload/v1766609476/Statly/mw2019-weapon-camos/SPLINTER/Sharp_Edges_Camo_Icon_MW2019.webp"
    ],
    "TOPO": [
        "https://res.cloudinary.com/dvsuz3v37/image/upload/v1766609484/Statly/mw2019-weapon-camos/TOPO/Off-Grid_Camo_Icon_MW2019.webp",
        "https://res.cloudinary.com/dvsuz3v37/image/upload/v1766609484/Statly/mw2019-weapon-camos/TOPO/Night_Seas_Camo_Icon_MW2019.webp",
        "https://res.cloudinary.com/dvsuz3v37/image/upload/v1766609484/Statly/mw2019-weapon-camos/TOPO/Marsh_Ops_Camo_Icon_MW2019.webp",
        "https://res.cloudinary.com/dvsuz3v37/image/upload/v1766609484/Statly/mw2019-weapon-camos/TOPO/Forestation_Camo_Icon_MW2019.webp",
        "https://res.cloudinary.com/dvsuz3v37/image/upload/v1766609484/Statly/mw2019-weapon-camos/TOPO/Phosphor_Camo_Icon_MW2019.webp",
        "https://res.cloudinary.com/dvsuz3v37/image/upload/v1766609486/Statly/mw2019-weapon-camos/TOPO/Vector_Trails_Camo_Icon_MW2019.webp",
        "https://res.cloudinary.com/dvsuz3v37/image/upload/v1766609486/Statly/mw2019-weapon-camos/TOPO/Topo_Trip_Camo_Icon_MW2019.webp",
        "https://res.cloudinary.com/dvsuz3v37/image/upload/v1766609483/Statly/mw2019-weapon-camos/TOPO/Barren_Camo_Icon_MW2019.webp",
        "https://res.cloudinary.com/dvsuz3v37/image/upload/v1766609486/Statly/mw2019-weapon-camos/TOPO/Vanished_Camo_Icon_MW2019.webp",
        "https://res.cloudinary.com/dvsuz3v37/image/upload/v1766609486/Statly/mw2019-weapon-camos/TOPO/SandStorm_Camouflage_MW2019.webp"
    ],
    "TIGER": [
        "https://res.cloudinary.com/dvsuz3v37/image/upload/v1766609482/Statly/mw2019-weapon-camos/TIGER/Overgrown_Camo_Icon_MW2019.webp",
        "https://res.cloudinary.com/dvsuz3v37/image/upload/v1766609483/Statly/mw2019-weapon-camos/TIGER/Mudslide_Camo_Icon_MW2019.webp",
        "https://res.cloudinary.com/dvsuz3v37/image/upload/v1766609482/Statly/mw2019-weapon-camos/TIGER/Dank_Forest_Camo_Icon_MW2019.webp",
        "https://res.cloudinary.com/dvsuz3v37/image/upload/v1766609480/Statly/mw2019-weapon-camos/TIGER/Abominable_Camo_Icon_MW2019.webp",
        "https://res.cloudinary.com/dvsuz3v37/image/upload/v1766609482/Statly/mw2019-weapon-camos/TIGER/Faded_Veil_Camo_Icon_MW2019.webp",
        "https://res.cloudinary.com/dvsuz3v37/image/upload/v1766609482/Statly/mw2019-weapon-camos/TIGER/Feral_Beast_Camo_Icon_MW2019.webp",
        "https://res.cloudinary.com/dvsuz3v37/image/upload/v1766609483/Statly/mw2019-weapon-camos/TIGER/Tiger_Stripes_Camo_Icon_MW2019.webp",
        "https://res.cloudinary.com/dvsuz3v37/image/upload/v1766609482/Statly/mw2019-weapon-camos/TIGER/Desert_Cat_Camo_Icon_MW2019.webp",
        "https://res.cloudinary.com/dvsuz3v37/image/upload/v1766609482/Statly/mw2019-weapon-camos/TIGER/Red_Tiger_Camo_Icon_MW2019.webp",
        "https://res.cloudinary.com/dvsuz3v37/image/upload/v1766609482/Statly/mw2019-weapon-camos/TIGER/Blue_Tiger_Camo_Icon_MW2019.webp"
    ],
    "STRIPES": [
        "https://res.cloudinary.com/dvsuz3v37/image/upload/v1766609480/Statly/mw2019-weapon-camos/STRIPES/Grassland_Camo_Icon_MW2019.webp",
        "https://res.cloudinary.com/dvsuz3v37/image/upload/v1766609480/Statly/mw2019-weapon-camos/STRIPES/Tigers_Mane_Camo_Icon_MW2019.webp",
        "https://res.cloudinary.com/dvsuz3v37/image/upload/v1766609480/Statly/mw2019-weapon-camos/STRIPES/The_Khan_Camo_Icon_MW2019.webp",
        "https://res.cloudinary.com/dvsuz3v37/image/upload/v1766609480/Statly/mw2019-weapon-camos/STRIPES/Savannah_Camo_Icon_MW2019.webp",
        "https://res.cloudinary.com/dvsuz3v37/image/upload/v1766609480/Statly/mw2019-weapon-camos/STRIPES/Zebra_Camo_Icon_MW2019.webp",
        "https://res.cloudinary.com/dvsuz3v37/image/upload/v1766609480/Statly/mw2019-weapon-camos/STRIPES/Bluegrass_Camo_Icon_MW2019.webp",
        "https://res.cloudinary.com/dvsuz3v37/image/upload/v1766609478/Statly/mw2019-weapon-camos/STRIPES/Africa_Camo_Icon_MW2019.webp",
        "https://res.cloudinary.com/dvsuz3v37/image/upload/v1766609479/Statly/mw2019-weapon-camos/STRIPES/Nu_Wave_Zebra_Camo_Icon_MW2019.webp",
        "https://res.cloudinary.com/dvsuz3v37/image/upload/v1766609480/Statly/mw2019-weapon-camos/STRIPES/Greengrass_Camo_Icon_MW2019.webp",
        "https://res.cloudinary.com/dvsuz3v37/image/upload/v1766609479/Statly/mw2019-weapon-camos/STRIPES/Pink_Zebra_Camo_Icon_MW2019.webp"
    ],
     "REPTILE": [
        "https://res.cloudinary.com/dvsuz3v37/image/upload/v1766609472/Statly/mw2019-weapon-camos/REPTILE/Python_Camo_Icon_MW2019.webp",
        "https://res.cloudinary.com/dvsuz3v37/image/upload/v1766609471/Statly/mw2019-weapon-camos/REPTILE/Rattlesnake_Camo_Icon_MW2019.webp",
        "https://res.cloudinary.com/dvsuz3v37/image/upload/v1766609471/Statly/mw2019-weapon-camos/REPTILE/Komodo_Camo_Icon_MW2019.webp",
        "https://res.cloudinary.com/dvsuz3v37/image/upload/v1766609469/Statly/mw2019-weapon-camos/REPTILE/Blue_Iguana_Camo_Icon_MW2019.webp",
        "https://res.cloudinary.com/dvsuz3v37/image/upload/v1766609469/Statly/mw2019-weapon-camos/REPTILE/Chupacabra_Camo_Icon_MW2019.webp",
        "https://res.cloudinary.com/dvsuz3v37/image/upload/v1766609471/Statly/mw2019-weapon-camos/REPTILE/Pink_Python_Camo_Icon_MW2019.webp",
        "https://res.cloudinary.com/dvsuz3v37/image/upload/v1766609467/Statly/mw2019-weapon-camos/REPTILE/Anaconda_Camo_Icon_MW2019.webp",
        "https://res.cloudinary.com/dvsuz3v37/image/upload/v1766609469/Statly/mw2019-weapon-camos/REPTILE/Bullsnake_Camo_Icon_MW2019.webp",
        "https://res.cloudinary.com/dvsuz3v37/image/upload/v1766609469/Statly/mw2019-weapon-camos/REPTILE/Gecko_Camo_Icon_MW2019.webp",
        "https://res.cloudinary.com/dvsuz3v37/image/upload/v1766609469/Statly/mw2019-weapon-camos/REPTILE/Gartersnake_Camo_Icon_MW2019.webp"
    ],
     "SKULLS": [
        "https://res.cloudinary.com/dvsuz3v37/image/upload/v1766609474/Statly/mw2019-weapon-camos/SKULLS/Necropolis_Camo_Icon_MW2019.webp",
        "https://res.cloudinary.com/dvsuz3v37/image/upload/v1766609471/Statly/mw2019-weapon-camos/SKULLS/Corpse_Digger_Camo_Icon_MW2019.webp",
        "https://res.cloudinary.com/dvsuz3v37/image/upload/v1766609474/Statly/mw2019-weapon-camos/SKULLS/Ossuary_Camo_Icon_MW2019.webp",
        "https://res.cloudinary.com/dvsuz3v37/image/upload/v1766609472/Statly/mw2019-weapon-camos/SKULLS/Haunting_Camo_Icon_MW2019.webp",
        "https://res.cloudinary.com/dvsuz3v37/image/upload/v1766609474/Statly/mw2019-weapon-camos/SKULLS/Phantom_Camo_Icon_MW2019.webp",
        "https://res.cloudinary.com/dvsuz3v37/image/upload/v1766609472/Statly/mw2019-weapon-camos/SKULLS/Forest_Wraith_Camo_Icon_MW2019.webp",
        "https://res.cloudinary.com/dvsuz3v37/image/upload/v1766609472/Statly/mw2019-weapon-camos/SKULLS/Hemophiliac_Camo_Icon_MW2019.webp",
        "https://res.cloudinary.com/dvsuz3v37/image/upload/v1766609474/Statly/mw2019-weapon-camos/SKULLS/Skullduggery_Camo_Icon_MW2019.webp",
        "https://res.cloudinary.com/dvsuz3v37/image/upload/v1766609473/Statly/mw2019-weapon-camos/SKULLS/Cthulhu_Camo_Icon_MW2019.webp",
        "https://res.cloudinary.com/dvsuz3v37/image/upload/v1766609472/Statly/mw2019-weapon-camos/SKULLS/Lichyard_Camo_Icon_MW2019.webp"
    ],
     "COMPLETIONIST": [
        "https://res.cloudinary.com/dvsuz3v37/image/upload/v1766609435/Statly/mw2019-weapon-camos/COMPLETIONIST/Gold_Camo_Icon_MW2019.webp",
        "https://res.cloudinary.com/dvsuz3v37/image/upload/v1766609435/Statly/mw2019-weapon-camos/COMPLETIONIST/Platinum_Camo_Icon_MW2019.webp",
        "https://res.cloudinary.com/dvsuz3v37/image/upload/v1766609435/Statly/mw2019-weapon-camos/COMPLETIONIST/Damascus_Camo_Icon_MW2019.webp",
        "https://res.cloudinary.com/dvsuz3v37/image/upload/v1766609435/Statly/mw2019-weapon-camos/COMPLETIONIST/Obsidian_Camo_Icon_MW2019.webp",
    ],
}

export const POKEMON_TCG_CARDS = {
    "FULL ART": fullArtPokemonCardImages,
    "GOOGLE SHEETS": googleSheetsPokemonCardImages
}

export const MEDALS_GAMES = {
    "BF1 (MEDALS)": {
        "MEDALS_ORDER": [
            "VEHICLES", 
            "CLASS", 
            "WEAPONS", 
            "GAMEMODE", 
            "COMBAT", 
            "SQUAD"
        ],
        "MEDALS_OBJ": BATTLEFIELD_1_MEDALS
    },
    "BF1 (RIBBONS)": {
        "MEDALS_ORDER": [
            "VEHICLE", 
            "CLASS", 
            "WEAPON", 
            "GAMEMODE", 
            "COMBAT", 
            "SQUAD"
        ],
        "MEDALS_OBJ": BATTLEFIELD_1_RIBBONS
    },
    "BF3 (MEDALS)": {
        "MEDALS_ORDER": [
            "GENERAL",
            "WEAPONS AND BONUSES",
            "KITS",
            "VEHICLES",
            "PERFORMANCE",
            "OBJECTIVES"
        ],
        "MEDALS_OBJ": BATTLEFIELD_3_MEDALS
    },
    "BF3 (RIBBONS)": {
        "MEDALS_ORDER": [
            "WEAPONS",
            "STREAKS",
            "KITS",
            "VEHICLES",
            "MVP",
            "GAME MODES",
            "GAME MODES (WINNER)",
            "OTHER",
        ],
        "MEDALS_OBJ": BATTLEFIELD_3_RIBBONS
    },
    "BF4 (MEDALS)": {
        "MEDALS_ORDER": [
            "KITS",
            "GAME MODE",
            "WEAPONS",
            "VEHICLES",
            "TEAM"
        ],
        "MEDALS_OBJ": BATTLEFIELD_4
    },
    "BF4 (RIBBONS)": {
        "MEDALS_ORDER": [
            "KITS",
            "GAME MODE",
            "WEAPONS",
            "VEHICLES",
            "TEAM"
        ],
        "MEDALS_OBJ": BATTLEFIELD_4_RIBBONS
    },
    "BFV (RIBBONS)": {
        "MEDALS_ORDER": [
            "STRATEGIC",
            "COMBAT SERVICE",
            "TEAMWORK"
        ],
        "MEDALS_OBJ": BATTLEFIELD_V_RIBBONS
    },
    "BF HARDLINE (MEDALS)": {
        "MEDALS_ORDER": [
            "WEAPONS",
            "VEHICLES",
            "TEAM",
            "ROBBERY",
            "KITS",
            "GETAWAY",
            "GENERAL",
            "GAME MODE",
            "CRIMINAL ACTIVITY"
        ],
        "MEDALS_OBJ": BATTLEFIELD_HARDLINE_MEDALS
    },
    "BO2 (CALLING CARDS)": {
        "MEDALS_ORDER": [
            "GENERAL"
        ],
        "MEDALS_OBJ": BLACK_OPS_2_CALLING_CARDS
    },
    "BO2 (MEDALS)": {
        "MEDALS_ORDER": [
            "KILLSTREAKS"
        ],
        "MEDALS_OBJ": BLACK_OPS_2_KILLSTREAK_MEDALS
    },
    "AC7 (MEDALS)": {
        "MEDALS_ORDER": [
            "CAMPAIGN",
            "VR MODE",
            "MULTIPLAYER"
        ],
        "MEDALS_OBJ": ACE_COMBAT_7_MEDALS
    },
    "POKEMON TCG CARDS": {
        "MEDALS_ORDER": [
            "FULL ART",
            "GOOGLE SHEETS",
        ],
        "MEDALS_OBJ": POKEMON_TCG_CARDS
    },
    "MW2019 (WEAPON CAMOS)": {
        "MEDALS_ORDER": [
            "SPRAY PAINT",
            "WOODLAND",
            "DIGITAL",
            "DRAGON",
            "SPLINTER",
            "TOPO",
            "TIGER",
            "STRIPES",
            "REPTILE",
            "SKULLS",
            "COMPLETIONIST",
        ],
        "MEDALS_OBJ": MW2019_WEAPON_CAMOS
    },
    "CUSTOM": {
        "MEDALS_ORDER": [
            "GENERAL"
        ],
        "MEDALS_OBJ": {
            "GENERAL": [] // Populated dynamically from API
        }
    },
}

export const BATTLEFIELD_1_MEDALS_BY_URL = Object.entries(BATTLEFIELD_1_MEDALS).reduce((acc: Record<string, string>, [category, urls]) => {
  urls.forEach(url => {
    acc[url] = category; // key = URL, value = category
  });
  return acc;
}, {});

export const BATTLEFIELD_3_MEDALS_BY_URL = Object.entries(BATTLEFIELD_3_MEDALS).reduce((acc: Record<string, string>, [category, urls]) => {
  urls.forEach(url => {
    acc[url] = category; // key = URL, value = category
  });
  return acc;
}, {});

// Type for Pokemon card image objects
interface PokemonCardImage {
  name: string;
  originalImageUrl: string;
  imgurImageUrl: string;
}

// Type for medal image URLs (can be either a string or a Pokemon card object)
type MedalImageUrl = string | PokemonCardImage;

// Comprehensive reverse lookup map for all games and medal types
export const URL_TO_GAME_MEDAL_MAP = new Map();

// Populate the map once at module load time
Object.entries(MEDALS_GAMES).forEach(([gameName, gameData]) => {
  Object.entries(gameData.MEDALS_OBJ).forEach(([medalTypeName, imageUrls]) => {
    imageUrls.forEach((urlOrObj: MedalImageUrl) => {
      const url = gameName === 'POKEMON TCG CARDS' ? (urlOrObj as PokemonCardImage).imgurImageUrl : urlOrObj as string;
      URL_TO_GAME_MEDAL_MAP.set(url, { game: gameName, medalType: medalTypeName });
    });
  });
});