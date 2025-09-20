// Singleton - единые настройки игры
class GameConfig {
    static instance = null;

    constructor() {
        if (GameConfig.instance) return GameConfig.instance;
        
        this.maxHealth = 20;
        this.maxRounds = 10;
        this.criticalDamage = 1.5;
        this.baseArmor = 2;
        
        GameConfig.instance = this;
    }

    static getConfig() {
        if (!GameConfig.instance) {
            GameConfig.instance = new GameConfig();
        }
        return GameConfig.instance;
    }
}

// Builder - создаем персонажей с разными параметрами
class CharacterBuilder {
    constructor(name) {
        this.name = name;
        this.health = 15;
        this.armor = 2;
        this.dodge = 0.1;
        this.critical = 0.2;
    }

    setHealth(value) {
        this.health = value;
        return this;
    }

    setArmor(value) {
        this.armor = value;
        return this;
    }

    setDodge(value) {
        this.dodge = value;
        return this;
    }

    setCritical(value) {
        this.critical = value;
        return this;
    }

    build() {
        return new Character(
            this.name,
            this.health,
            this.armor,
            this.dodge,
            this.critical
        );
    }
}

// Factory - создаем оружие
class WeaponFactory {
    static createWeapon(type) {
        switch(type) {
            case 'pepper':
                return { name: 'перцовка', min: 3, max: 6, accuracy: 0.8 };
            case 'knuckles':
                return { name: 'кастет', min: 2, max: 8, accuracy: 0.7 };
            default:
                return { name: 'перцовка', min: 3, max: 6, accuracy: 0.8 };
        }
    }
}

// Класс персонажа
class Character {
    constructor(name, health, armor, dodge, critical) {
        this.name = name;
        this.health = health;
        this.armor = armor;
        this.dodge = dodge;
        this.critical = critical;
        this.weapon = null;
    }

    chooseWeapon() {
        const weapon1 = WeaponFactory.createWeapon('pepper');
        const weapon2 = WeaponFactory.createWeapon('knuckles');
        this.weapon = Math.random() > 0.5 ? weapon1 : weapon2;
        console.log(`${this.name} берет ${this.weapon.name}`);
    }

    attack(target) {
        // Проверка на уклонение
        if (Math.random() < target.dodge) {
            console.log(`${target.name} увернулся!`);
            return;
        }

        // Проверка на попадание
        if (Math.random() > this.weapon.accuracy) {
            console.log(`${this.name} промахнулся!`);
            return;
        }

        // Расчет урона
        let damage = Math.floor(Math.random() * (this.weapon.max - this.weapon.min + 1)) + this.weapon.min;
        
        // Критический удар
        if (Math.random() < this.critical) {
            damage = Math.floor(damage * 1.5);
            console.log(`${this.name} наносит критический удар!`);
        }

        // Учет брони
        const actualDamage = Math.max(0, damage - target.armor);
        target.health -= actualDamage;

        console.log(`${this.name} бьет ${this.weapon.name} -> ${damage} урона`);
        console.log(`${target.name} теряет ${actualDamage} здоровья`);
        console.log(`У ${target.name} осталось ${target.health} HP`);
    }

    isAlive() {
        return this.health > 0;
    }
}

// Создаем персонажей через Builder
const punk = new CharacterBuilder("Панк")
    .setHealth(18)
    .setArmor(2)
    .setDodge(0.1)
    .build();

const nefor = new CharacterBuilder("Нефор")
    .setHealth(15)
    .setArmor(1)
    .setDodge(0.3)
    .build();

const normis = new CharacterBuilder("Нормис")
    .setHealth(16)
    .setArmor(3)
    .setDodge(0.05)
    .build();

const pickme = new CharacterBuilder("Пикми мальчик")
    .setHealth(14)
    .setArmor(2)
    .setDodge(0.2)
    .build();

// Все бойцы
const fighters = [punk, nefor, normis, pickme];

// Даем каждому оружие
fighters.forEach(fighter => fighter.chooseWeapon());

// Функция боя
function fight(first, second, fightNumber) {
    console.log(`\n--- Бой ${fightNumber}: ${first.name} vs ${second.name} ---`);
    
    let round = 1;
    const config = GameConfig.getConfig();
    
    while (first.isAlive() && second.isAlive() && round <= config.maxRounds) {
        console.log(`\nРаунд ${round}:`);
        
        first.attack(second);
        if (!second.isAlive()) break;
        
        second.attack(first);
        if (!first.isAlive()) break;
        
        round++;
    }

    const winner = first.isAlive() ? first : second;
    console.log(`\nПобедил: ${winner.name}`);
    
    return winner.name;
}

// Запускаем турнир
console.log("Начинается турнир!");

const results = [];
let fightCount = 1;

// Бои каждый с каждым
for (let i = 0; i < fighters.length; i++) {
    for (let j = i + 1; j < fighters.length; j++) {
        const winner = fight(fighters[i], fighters[j], fightCount);
        results.push(`Бой ${fightCount}: ${winner}`);
        fightCount++;
        
        // Восстанавливаем здоровье
        fighters[i].health = 15;
        fighters[j].health = 15;
    }
}

// Результаты
console.log("\n--- Результаты турнира ---");
results.forEach(result => console.log(result));
console.log("Турнир окончен!");