// Nguồn dữ liệu thực đơn duy nhất (port từ data/menu-data.js cũ).
// Dùng build-time bởi các trang Astro (menu, category, dish-detail) → không còn fetch client.
export const menuData = {
    potages: {
        title: "Potages / Soups",
        items: [
            { name: "Potage pékinois piquant 🌶️", translation: "Hot and sour soup", price: "7", image: "/images/raw/b359074922003a80ca06eaac0c84c0c0.jpeg", description: "Un potage traditionnel épicé et aigre, un classique de la cuisine du Sichuan, parfait pour commencer le repas.", featured: true },
            { name: "Potage aux raviolis", translation: "Chinese dumpling soup (Wonton)", price: "7", image: "/images/raw/dc30192c551ff8a5779753dbb5b0e55c.jpeg", description: "Une soupe réconfortante avec de tendres raviolis chinois (Wonton) dans un bouillon savoureux." },
            { name: "Potage au poulet et aux vermicelles", translation: "Chicken and vermicelli soup", price: "8", image: "/images/food/food5.webp", description: "Un bouillon de poulet léger et parfumé, garni de vermicelles de riz et de morceaux de poulet tendres." },
            { name: "Potage au crabe et aux asperges", translation: "Crabmeat and asparagus soup", price: "10", image: "/images/food/food_placeholder.jpg", description: "Une soupe élégante et délicate, alliant la douceur de la chair de crabe à la fraîcheur des asperges." },
            { name: "Potage aux crevettes et à la citronnelle", translation: "Hot and sour shrimps soup", price: "11", image: "/images/food/food_placeholder.jpg", description: "Une soupe d'inspiration thaïlandaise, aigre-douce et parfumée à la citronnelle, avec des crevettes fraîches." }
        ]
    },
    entrees: {
        title: "Entrées / Starters",
        items: [
            { name: "Beignets de crevettes (4 pcs)", translation: "Deep-fried shrimps", price: "11", image: "/images/raw/bcd205d97a057075ef79e7642e9d3311.jpeg", description: "Crevettes croustillantes en friture, servies avec une sauce aigre-douce pour une entrée classique et délicieuse." },
            { name: "Côtes de porc pékinoises épicées (2 pcs) 🌶️", translation: "Beijing style spicy spare ribs", price: "9", image: "/images/food/food_placeholder.jpg", description: "Côtes de porc marinées dans une sauce pékinoise épicée, puis grillées à la perfection." },
            { name: "Rouleaux de printemps aux légumes (2 pcs)", translation: "Spring rolls with vegetables", price: "8", image: "/images/raw/025faa602c1fca6d8ddef50699cdf820.jpeg", description: "Rouleaux croustillants remplis d'un mélange de légumes frais, une option végétarienne parfaite." },
            { name: "Rouleaux de printemps vietnamiens «Nems» (4 pcs)", translation: "Vietnamese spring rolls", price: "13", image: "/images/raw/5c5955a02952a7322caea788204fbb8a.jpeg", description: "Les traditionnels nems vietnamiens, frits et croustillants, servis avec de la laitue, de la menthe et une sauce nuoc mam.", featured: true },
            { name: "Raviolis frits (8 pcs)", translation: "Deep-fried wontons", price: "8", image: "/images/raw/12c5b4d9f6de5a4c79e593a3d5111d49.jpeg", description: "Des raviolis wonton dorés et croustillants, parfaits pour tremper dans notre sauce maison." },
            { name: "Raviolis grillés (5 pcs)", translation: "Potstickers (grilled dumplings)", price: "10", image: "/images/food/food14.webp", description: "Raviolis grillés d'un côté et cuits à la vapeur de l'autre, offrant une texture à la fois croustillante et moelleuse." },
            { name: "Assortiment « 4 Saisons » d'entrées frites (pour 2 pers.)", translation: "« 4 Seasons » assorted appetizers", price: "20", image: "/images/raw/a828390e4abc8ccf1693638de2ae0182.jpeg", description: "Un plateau de dégustation de nos meilleures entrées frites, idéal pour partager à deux." },
            { name: "Canard croustillant avec crêpes (pour 2 pers.)", translation: "Crispy duck with pancakes", price: "25", image: "/images/food/food6.webp", description: "Une entrée festive avec de la peau de canard croustillante, servie avec des crêpes fines, de la ciboule et une sauce hoisin." }
        ]
    },
    dimsum: {
        title: "Dim Sum (Vapeur)",
        items: [
            { name: "Petits pains aux légumes et au poulet (4 pcs)", translation: "Steamed buns with chicken & vegetables", price: "8", image: "/images/food/food19.webp", description: "Petits pains moelleux cuits à la vapeur, farcis d'un savoureux mélange de poulet et de légumes." },
            { name: "Siu Mai à la vapeur (5 pcs)", translation: "Siu Mai dumplings", price: "10", image: "/images/food/food8.webp", description: "Bouchées traditionnelles à base de porc et de crevettes, cuites à la vapeur dans une fine pâte de blé." },
            { name: "Raviolis de porc à la vapeur (5 pcs)", translation: "Pork dumplings", price: "10", image: "/images/raviolis-vapeur.jpg", description: "Tendres raviolis farcis au porc haché assaisonné, un classique incontournable des Dim Sum." },
            { name: "Raviolis aux crevettes Ha Kao (5 pcs)", translation: "Ha Kao dumplings", price: "11", image: "/images/food/food1.webp", description: "Des raviolis à la pâte translucide et délicate, renfermant une crevette entière juteuse." },
            { name: "Assortiment «4 Saisons» à la vapeur (pour 2 pers.)", translation: "Steamed «4 Seasons» dim sum", price: "20", image: "/images/food/food8.webp", description: "Une sélection de nos meilleurs Dim Sum cuits à la vapeur, parfait pour découvrir une variété de saveurs.", featured: true }
        ]
    },
    nouilles: {
        title: "Nouilles / Noodles",
        items: [
            { name: "Nouilles sautées aux légumes", translation: "Stir-fried noodles with vegetables", price: "17", image: "/images/raw/489d407834cf3b85c431defeec3145de.jpeg", description: "Un plat végétarien savoureux de nouilles sautées avec un assortiment de légumes frais de saison." },
            { name: "Nouilles sautées au poulet", translation: "Stir-fried noodles with chicken", price: "21", image: "/images/food/food16.webp", description: "Nouilles de blé sautées au wok avec des morceaux de poulet tendres et des légumes croquants." },
            { name: "Vermicelles à la façon de Singapour", translation: "Singaporean style fried vermicelli", price: "23", image: "/images/food/food_placeholder.jpg", description: "Vermicelles de riz fins sautés avec une poudre de curry, des crevettes, du porc et des légumes." },
            { name: "Nouilles sautées au bœuf", translation: "Fried noodles with beef", price: "25", image: "/images/caption (3).jpg", description: "Nouilles épaisses sautées avec de fines tranches de bœuf et une sauce savoureuse." },
            { name: "Nouilles croustillantes au poulet sur ardoise", translation: "Crispy noodles with chicken (sizzling)", price: "25", image: "/images/food/food_placeholder.jpg", description: "Un nid de nouilles frites croustillantes surmonté d'un sauté de poulet et de légumes servi sur une plaque chauffante." }
        ]
    },
    vegetariens: {
        title: "Plats végétariens / Vegetarian",
        items: [
            { name: "Tofu sauté aux légumes", translation: "Fried tofu with vegetables", price: "22", image: "/images/food/food13.webp", description: "Cubes de tofu soyeux sautés avec une variété de légumes de saison dans une sauce légère." },
            { name: "Tofu aux champignons parfumés et pousses de bambou", translation: "Tofu with chinese mushrooms & bamboo", price: "23", image: "/images/food/food12.webp", description: "Un plat végétarien classique avec du tofu, des champignons shiitake parfumés et des pousses de bambou croquantes." },
            { name: "Tofu au curry rouge", translation: "Red curry tofu", price: "24", image: "/images/raw/b459b19298f895e788f1f92ad36da347.jpeg", description: "Tofu tendre mijoté dans une sauce au curry rouge crémeuse et légèrement épicée." },
            { name: "Tofu sauté aux aubergines, sauce pimentée 🌶️", translation: "Fried tofu with eggplants, spicy sauce", price: "24", image: "/images/raw/bef0757435ae52722b20f3d4404075b1.jpeg", description: "Une combinaison savoureuse de tofu frit et d'aubergines fondantes dans une sauce pimentée." }
        ]
    },
    poulet: {
        title: "Poulet / Chicken",
        items: [
            { name: "Poulet sauté aux légumes", translation: "Chicken with mixed vegetables", price: "24", image: "/images/food/food_placeholder.jpg", description: "Morceaux de poulet tendres sautés au wok avec un assortiment de légumes frais et croquants." },
            { name: "Poulet à la sauce à l'haricot noir", translation: "Black bean sauce chicken", price: "24", image: "/images/food/food_placeholder.jpg", description: "Un plat savoureux avec des morceaux de poulet dans une sauce riche à base de haricots noirs fermentés." },
            { name: "Poulet curry", translation: "Curry chicken", price: "24", image: "/images/raw/bfc75e4d9c7e83cdd6f45f4fb62fd685.jpeg", description: "Poulet mijoté dans une sauce au curry jaune onctueuse et parfumée, servi avec des légumes." },
            { name: "Poulet à la sauce saté piquante 🌶️", translation: "Spicy Satay chicken", price: "24", image: "/images/food/food_placeholder.jpg", description: "Brochettes de poulet ou émincé sauté dans une sauce saté aux cacahuètes, relevée d'une touche de piment." },
            { name: "Poulet Sichuan piquant 🌶️", translation: "Spicy Sichuan style chicken", price: "24", image: "/images/raw/c3a9713111d9a9a622a6106866c25d08.jpeg", description: "Un plat emblématique du Sichuan, avec du poulet sauté dans une sauce pimentée et parfumée au poivre de Sichuan." },
            { name: "Filet de poulet au citron", translation: "Lemon chicken", price: "25", image: "/images/raw/8f136cab606a17209f9100a7cc1756e8.jpeg", description: "Filet de poulet croustillant nappé d'une sauce au citron douce et acidulée.", featured: true },
            { name: "Filet de poulet à la sauce aigre-douce piquante 🌶️", translation: "Spicy sweet & sour chicken", price: "25", image: "/images/food/food10.webp", description: "Poulet croustillant enrobé d'une sauce aigre-douce classique avec une touche pimentée." },
            { name: "Poulet sur ardoise chaude", translation: "Sizzling chicken", price: "26", image: "/images/food/food_placeholder.jpg", description: "Morceaux de poulet tendres et légumes frais grésillant sur une plaque chauffante, un plat spectaculaire et savoureux." }
        ]
    },
    porc: {
        title: "Porc / Pork",
        items: [
            { name: "Porc à la sauce aigre-douce", translation: "Sweet and sour pork", price: "23", image: "/images/food/food15.webp", description: "Bouchées de porc croustillantes nappées de la fameuse sauce aigre-douce avec ananas, poivrons et oignons." },
            { name: "Porc aux champignons parfumés et pousses de bambou", translation: "Pork with chinese mushrooms & bamboo", price: "23", image: "/images/food/food_placeholder.jpg", description: "Tranches de porc tendres sautées avec des champignons shiitake et des pousses de bambou." },
            { name: "Porc rôti à la cantonaise", translation: "Grilled pork in Cantonese style", price: "25", image: "/images/food/food4.webp", description: "Porc laqué au miel, rôti lentement pour une viande juteuse et une peau caramélisée." }
        ]
    },
    boeuf: {
        title: "Bœuf / Beef",
        items: [
            { name: "Bœuf au curry", translation: "Beef curry", price: "25", image: "/images/raw/24c6d075305257e3c4ca3604ab21962f.jpeg", description: "Fines tranches de bœuf mijotées dans une sauce curry riche et crémeuse." },
            { name: "Bœuf aux poivrons, sauce à l'haricot noir", translation: "Black bean sauce beef", price: "25", image: "/images/raw/b42d5fd283b2283b98cd770c036337b0.jpeg", description: "Un sauté classique de bœuf tendre et de poivrons croquants dans une sauce aux haricots noirs savoureuse." },
            { name: "Bœuf à la sauce saté piquante 🌶️", translation: "Spicy satay beef", price: "25", image: "/images/food/food_placeholder.jpg", description: "Bœuf mariné et sauté dans une sauce onctueuse aux cacahuètes avec une note épicée." },
            { name: "Bœuf Sichuan piquant 🌶️", translation: "Spicy Sichuan style beef", price: "25", image: "/images/food/food_placeholder.jpg", description: "Émincé de bœuf sauté vivement avec des piments et du poivre de Sichuan pour une saveur authentique et relevée." },
            { name: "Bœuf sauté aux champignons et pousses de bambou", translation: "Beef with chinese mushrooms & bamboo", price: "25", image: "/images/food/food_placeholder.jpg", description: "Un sauté réconfortant de bœuf avec des champignons chinois et des pousses de bambou." },
            { name: "Bœuf croustillant, sauce aigre-douce piquante 🌶️", translation: "Crispy beef in a spicy sweet & sour sauce", price: "26", image: "/images/raw/e0fbfb6a6a39997b603939c0bdca3174.jpeg", description: "Fines lanières de bœuf frites jusqu'à être croustillantes, puis enrobées d'une sauce aigre-douce relevée d'une pointe de piment.", featured: true },
            { name: "Bœuf sur ardoise chaude", translation: "Sizzling beef", price: "28", image: "/images/food/food_placeholder.jpg", description: "Émincé de bœuf et légumes variés servis grésillants sur une plaque en fonte, libérant des arômes irrésistibles." }
        ]
    },
    canard: {
        title: "Canard / Duck",
        items: [
            { name: "Canard au gingembre et à la ciboulette", translation: "Duck with ginger and chives", price: "27", image: "/images/food/food_placeholder.jpg", description: "Canard rôti sauté avec du gingembre frais et de la ciboulette pour un plat plein de saveurs." },
            { name: "Canard Sichuan piquant 🌶️", translation: "Spicy Sichuan style duck", price: "27", image: "/images/food/food_placeholder.jpg", description: "Tranches de canard rôti nappées d'une sauce épicée de style Sichuan." },
            { name: "Canard rôti à la cantonaise", translation: "Roast duck in Cantonese style", price: "27", image: "/images/raw/106b0d58c373ec884b50015ab7a34fc0.jpeg", description: "Le fameux canard rôti à la cantonaise, avec sa peau croustillante et sa chair tendre et juteuse." },
            { name: "Canard sauté piquant à la pékinoise 🌶️", translation: "Spicy duck in Beijing style", price: "27", image: "/images/food/food_placeholder.jpg", description: "Canard sauté dans une sauce pékinoise relevée, un délice pour les amateurs de saveurs fortes." },
            { name: "Magret de canard sur ardoise chaude", translation: "Sizzling duck breast", price: "29", image: "/images/caption (3).jpg", description: "Magret de canard rosé et tendre, servi sur une plaque chauffante pour une expérience culinaire mémorable." },
            { name: "Canard laqué pékinois, 3 services", translation: "Roasted Beijing duck, 3 services", price: "50", image: "/images/food/food3.webp", description: "Le plat signature : peau croustillante servie avec des crêpes, suivie de la chair de canard sautée. Un festin royal.", featured: true }
        ]
    },
    crevettes: {
        title: "Crevettes / Shrimps",
        items: [
            { name: "Crevettes au curry", translation: "Curry shrimps", price: "27", image: "/images/food/food_placeholder.jpg", description: "Crevettes juteuses mijotées dans une sauce au curry onctueuse et parfumée." },
            { name: "Crevettes sautées, sauce à l'haricot noir", translation: "Black bean sauce shrimps", price: "27", image: "/images/raw/98de32111fe88d40b8839c0389d40e67.jpeg", description: "Crevettes et légumes sautés dans une sauce riche et salée aux haricots noirs." },
            { name: "Crevettes Sichuan piquantes 🌶️", translation: "Sichuan style shrimps", price: "27", image: "/images/crevettes-5-epices.jpg", description: "Crevettes sautées dans une sauce pimentée de style Sichuan, un plat plein de caractère." },
            { name: "Crevettes aux champignons et pousses de bambou", translation: "Shrimps with mushrooms & bamboo", price: "27", image: "/images/food/food_placeholder.jpg", description: "Un sauté léger et savoureux de crevettes, champignons parfumés et pousses de bambou." },
            { name: "Crevettes à la sauce aigre-douce", translation: "Sweet and sour shrimps", price: "27", image: "/images/food/food_placeholder.jpg", description: "Crevettes en beignets croustillants, enrobées d'une sauce aigre-douce classique." },
            { name: "Crevettes sur ardoise chaude", translation: "Sizzling shrimps", price: "29", image: "/images/food/food_placeholder.jpg", description: "Grosses crevettes et légumes servis grésillants sur une plaque en fonte chaude." }
        ]
    },
    poisson: {
        title: "Poisson / Fish",
        items: [
            { name: "Filet de poisson grillé", translation: "Grilled fish", price: "25", image: "/images/food/food_placeholder.jpg", description: "Filet de poisson blanc grillé, assaisonné simplement pour mettre en valeur sa saveur délicate." },
            { name: "Filet de poisson « 4 Saisons » à la vapeur", translation: "« 4 Seasons » special steamed fish", price: "26", image: "/images/food/food_placeholder.jpg", description: "Filet de poisson cuit à la vapeur avec du gingembre, de la ciboulette et une sauce soja légère, une spécialité saine et savoureuse." }
        ]
    },
    accompagnements: {
        title: "Accompagnements / Side Dishes",
        items: [
            { name: "Pousses de soja sautées", translation: "Stir-fried bean sprouts", price: "12", image: "/images/food/food_placeholder.jpg", description: "Pousses de soja croquantes sautées rapidement au wok." },
            { name: "Légumes Chop-soy sautés", translation: "Stir-fried chop suey", price: "12", image: "/images/food/food_placeholder.jpg", description: "Un mélange coloré de légumes de saison sautés, croquants et pleins de saveurs." },
            { name: "Riz nature parfumé au jasmin", translation: "Steamed jasmine rice", price: "3", image: "/images/food/food_placeholder.jpg", description: "Riz blanc parfumé cuit à la vapeur, l'accompagnement parfait pour tous nos plats." },
            { name: "Riz sauté Bouddha", translation: "Vegetarian fried rice", price: "6", image: "/images/food/food18.webp", description: "Riz sauté végétarien avec des œufs, des petits pois, du maïs et d'autres légumes." },
            { name: "Riz sauté cantonais", translation: "Cantonese fried rice", price: "7", image: "/images/raw/23e89d5e32bc8704f1591f1c80be31f9.jpeg", description: "Le riz frit classique avec du porc rôti, des crevettes, des œufs et des légumes." }
        ]
    }
};

// Thứ tự hiển thị các nhóm trên trang "La Carte" (à la carte).
export const menuOrder = [
    'potages', 'entrees', 'dimsum', 'nouilles', 'vegetariens',
    'poulet', 'porc', 'boeuf', 'canard', 'crevettes', 'poisson', 'accompagnements',
];

// Cấu hình 6 thẻ category cho slider "La carte des mets" (giữ icon + link như cũ).
export const sliderCategories = [
    { label: 'Menus',             href: '/menu',                              icon: 'salades' },
    { label: 'Entrées',          href: '/menu/category?category=entrees', icon: 'entrees' },
    { label: 'Dim Sum',           href: '/menu/category?category=dimsum',  icon: 'dimsum'  },
    { label: 'Potages et soupes', href: '/menu/category?category=potages', icon: 'potages' },
    { label: 'Poulet',            href: '/menu/category?category=poulet',  icon: 'poulet'  },
    { label: 'Bœuf',              href: '/menu/category?category=boeuf',   icon: 'boeuf'   },
];
