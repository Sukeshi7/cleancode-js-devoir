
import weapons from './weaponList.json';

export let weaponList: any[] = [];

export function init() {
    weaponList = weapons;


    let playerMaxHealth = 10;
    let playerCurrentHealth = 10;
    let enemyMaxHealth = 10;
    let enemyCurrentHealth = 10;
    let playerWeapon = weaponList[Math.floor(Math.random() * weaponList.length)];
    let enemyWeapon = null;
    let hasInit = true;
    let hasRound = true;
    let hasFought = false;
    let playerWon = false;
    let playerLost = false;

    let rerolls = 3;

    weaponList = weapons;

    return {
        playerMaxHealth,
        playerCurrentHealth,
        enemyMaxHealth,
        enemyCurrentHealth,
        playerWeapon,
        enemyWeapon,
        hasInit,
        hasRound,
        hasFought,
        playerWon,
        playerLost,
        rerolls
    }
}

export function newRound(hasInit: boolean) {
    if(hasInit) {
        weaponList = weapons;

        return {
            playerWeapon: weaponList[Math.floor(Math.random() * weaponList.length)],
            enemyWeapon: null,
            hasRound: true,
            hasFought: false,
            rerolls: 3
        }
    } else {
        throw new Error('Game not initialized');
    }
}

export function fight(playerHealth: number, enemyHealth: number, playerWeapon: any, hasInit: boolean, hasRound: boolean, hasFought: boolean): Array<number|boolean> {

    if (!hasInit) {
        throw new Error('Game not initialized');
    }

    if (!hasRound) {
        throw new Error('Round not initialized');
    }

    if (hasFought) {
        throw new Error('Round already played');
    }

    let playerDamages: number = 0;
    let enemyDamages: number = 0;

    playerDamages += getWeaponDamages(playerWeapon);

    // reset weapon list so the enemy could play
    weaponList = weapons;

    let enemyWeapon = weaponList[Math.floor(Math.random() * weaponList.length)];

    enemyDamages += getWeaponDamages(enemyWeapon);

    [playerHealth, enemyHealth] = damageHandler(playerDamages, enemyDamages, playerHealth, enemyHealth);

    if(enemyHealth === 0) {
        return [playerHealth, enemyHealth, enemyWeapon, true, true, false];
    }

    if(playerHealth === 0) {
        return [playerHealth, enemyHealth, enemyWeapon, true, false, true];
    }

    return [playerHealth, enemyHealth, enemyWeapon, true, false, false];
}

function getWeaponDamages(weapon){
    const weaponsDamages = {
        'hatchet': () => 1,
        'knife': () => 1,
        'spear': () => 1,
        'sword': () => 5,
        'halberd': () => 5,
        'bow': () => 1 * (Math.floor(Math.random() * 5)),
        'crossbow': () => 2 * (Math.floor(Math.random() * 5)),
        'darts': () => 1 * (Math.floor(Math.random() * 3)),
        'dagger': () => 3
    }

    const damageFunction = weaponsDamages[weapon.name];
    if (damageFunction) {
        return damageFunction();
    } else {
        throw new Error('Invalid weapon');
    }
}

function damageHandler(playerDamages: number, enemyDamages: number, playerHealth: number, enemyHealth: number) {
    if(playerDamages === enemyDamages) {
        return [playerHealth, enemyHealth];
    }

    if(playerDamages > enemyDamages) {
        enemyHealth -= playerDamages - enemyDamages;
    } else {
        playerHealth -= enemyDamages - playerDamages;
    }

    if(playerHealth <= 0) {
        playerHealth = 0;
    }

    if(enemyHealth <= 0) {
        enemyHealth = 0;
    }

    return [playerHealth, enemyHealth];
}

export function rerollWeapon(rerolls: number, playerWeapon: any){
    if(rerolls <= 0) {
        throw new Error('No rerolls left');
    }
    rerolls--;

    weaponList = weapons.filter(weapon => weapon.name !== playerWeapon.name);
    playerWeapon = weaponList[Math.floor(Math.random() * weaponList.length)];

    return [rerolls, playerWeapon];
}
