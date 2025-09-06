// Класс оружия
class Weapon {
    constructor(name, minDamage, maxDamage, hitChance) {
        this.name = name;
        this.minDamage = minDamage;
        this.maxDamage = maxDamage;
        this.hitChance = hitChance;
    }
    
    getDamage() {
        if (Math.random() > this.hitChance) {
            return 0; // Промах
        }
        return Math.floor(Math.random() * (this.maxDamage - this.minDamage + 1)) + this.minDamage;
    }
}

// Базовый класс персонажа
class Character {
    constructor(name, health, armor, dodgeChance) {
        this.name = name;
        this.health = health;
        this.armor = armor;
        this.dodgeChance = dodgeChance;
        this.weapon = null;
        this.criticalChance = 0.2; // 20% шанс критического удара
    }
    
    chooseWeapon(weapon1, weapon2) {
        this.weapon = Math.random() > 0.5 ? weapon1 : weapon2;
        console.log(`${this.name} выбирает ${this.weapon.name}`);
    }
    
    attack(target) {
        // Проверка на уклонение
        if (Math.random() < target.dodgeChance) {
            console.log(`${target.name} уворачивается от атаки!`);
            return 0;
        }
        
        const baseDamage = this.weapon.getDamage();
        if (baseDamage === 0) {
            console.log(`${this.name} промахивается!`);
            return 0;
        }
        
        // Проверка на критический удар
        let damage = baseDamage;
        let isCritical = false;
        if (Math.random() < this.criticalChance) {
            damage = Math.floor(damage * 1.5);
            isCritical = true;
        }
        
        console.log(`${this.name} атакует ${target.name} ${this.weapon.name}ом!${isCritical ? ' КРИТИЧЕСКИЙ УДАР!' : ''}`);
        
        // Броня поглощает часть урона
        const actualDamage = Math.max(0, damage - target.armor);
        target.health -= actualDamage;
        
        console.log(`${target.name} броня поглотила ${target.armor} урона, получил ${actualDamage} урона`);
        console.log(`${target.name} HP: ${target.health > 0 ? target.health : 0}`);
        
        return actualDamage;
    }
    
    isAlive() {
        return this.health > 0;
    }
}

// Создаем оружие с разными характеристиками
const pepperSpray = new Weapon("перцовка", 3, 6, 0.8); // Высокий шанс попадания
const knuckleDuster = new Weapon("кастет", 2, 8, 0.7);  // Высокий урон, но меньше шанс попадания

// Создаем персонажей с разными характеристиками
const punk = new Character("Панк", 16, 2, 0.1);      // Много HP, средняя броня
const nefor = new Character("Нефор", 14, 1, 0.3);    // Высокий шанс уворота
const normis = new Character("Нормис", 13, 2, 0.2); // Сбалансированный
const pickme = new Character("Пикми мальчик", 15, 3, 0.05); // Высокая броня

// Каждый выбирает оружие
punk.chooseWeapon(pepperSpray, knuckleDuster);
nefor.chooseWeapon(pepperSpray, knuckleDuster);
normis.chooseWeapon(pepperSpray, knuckleDuster);
pickme.chooseWeapon(pepperSpray, knuckleDuster);

// Список всех бойцов
const fighters = [punk, nefor, normis, pickme];

// Функция боя 1 на 1
function fight(a, b, fightNumber) {
    console.log(`\n================================`);
    console.log(`БОЙ ${fightNumber}: ${a.name} vs ${b.name}`);
    console.log(`================================`);
    
    console.log(`${a.name} [HP:${a.health} ARM:${a.armor}] vs ${b.name} [HP:${b.health} ARM:${b.armor}]`);
    
    let round = 1;
    const maxRounds = 10;
    
    while (a.isAlive() && b.isAlive() && round <= maxRounds) {
        console.log(`\n----- РАУНД ${round} НАЧАЛСЯ -----`);
        
        // Случайный порядок атаки в каждом раунде
        if (Math.random() > 0.5) {
            a.attack(b);
            if (!b.isAlive()) break;
            b.attack(a);
        } else {
            b.attack(a);
            if (!a.isAlive()) break;
            a.attack(b);
        }
        
        console.log(`----- РАУНД ${round} ЗАВЕРШЕН -----`);
        round++;
    }
    
    let winner;
    if (!a.isAlive() && !b.isAlive()) {
        // Если оба мертвы - случайный победитель
        winner = Math.random() > 0.5 ? a : b;
        console.log(`\nОБА ПАЛИ В БОЮ! Случайный победитель: ${winner.name}`);
    } else if (a.isAlive()) {
        winner = a;
        console.log(`\nПОБЕДИТЕЛЬ: ${winner.name}`);
    } else {
        winner = b;
        console.log(`\nПОБЕДИТЕЛЬ: ${winner.name}`);
    }
    
    return winner;
}

// Запускаем все бои
console.log("ТУРНИР НАЧАЛСЯ!");

let fightNumber = 1;
const winners = [];

// Каждый с каждым в правильном порядке
for (let i = 0; i < fighters.length; i++) {
    for (let j = i + 1; j < fighters.length; j++) {
        const winner = fight(fighters[i], fighters[j], fightNumber);
        winners.push(winner.name);
        fightNumber++;
        
        // Восстанавливаем здоровье для следующего боя
        fighters[i].health = 15 + Math.floor(Math.random() * 3); // Случайное HP
        fighters[j].health = 15 + Math.floor(Math.random() * 3);
    }
}

console.log("\n========================================");
console.log("ИТОГИ ТУРНИРА:");
console.log("========================================");
winners.forEach((winner, index) => {
    console.log(`Бой ${index + 1}: победил ${winner}`);
});

console.log("\nТУРНИР ЗАВЕРШЕН!")