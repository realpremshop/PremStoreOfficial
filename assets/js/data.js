/* LuksShop — კატალოგი (სტატიკური მონაცემები, ინახება კოდში) */

const CATEGORIES = [
  { id: 'phone', name: 'ტელეფონის აქსესუარები', emoji: '📱' },
  { id: 'audio', name: 'აუდიო და ხმა', emoji: '🎧' },
  { id: 'watch', name: 'საათები და ბრასლეტები', emoji: '⌚' },
  { id: 'gadget', name: 'სმარტ გაჯეტები', emoji: '🔌' }
];

const IMG_BASE = 'https://media.base44.com/images/public/6acc7494199ac4cc4ec0860f/';
const img = hash => `${IMG_BASE}${hash}_generated_image.png/v1/fill/w_600,h_600,al_c,q_90,usm_0.66_1.00_0.01,enc_auto,quality_auto/${hash}_generated_image.png`;

const PRODUCTS = [
  {
    id: 'p1', name: 'მაგნიტური სილიკონის კეისი (MagSafe)', category: 'phone',
    price: 25, oldPrice: null, image: img('d9c1cf544'), rating: 4.8, stock: 24,
    desc: 'MagSafe-ის თავსებადი სილიკონის კეისი ძლიერი მაგნიტური რგოლით — უზრუნველყოფს უსადენო დატენვას და მყარ დაჭერას.',
    specs: ['სილიკონი + მიკროფიბრა', 'MagSafe მაგნიტური რგოლი', 'დაცვა კუთხეებზე']
  },
  {
    id: 'p2', name: '65W GaN სწრაფი დამტენი USB-C', category: 'phone',
    price: 30, oldPrice: 40, image: img('3ba764e83'), rating: 4.9, stock: 18,
    desc: 'კომპაქტური GaN დამტენი 65W სიმძლავრით — ავსებს ტელეფონს, პლანშეტსა და ლეპტოპს რამდენიმე ჯერ უფრო სწრაფად.',
    specs: ['65W, 2× USB-C + USB-A', 'GaN ტექნოლოგია, დაბალი გახურება', 'უნივერსალური ძაბვა 100–240V']
  },
  {
    id: 'p3', name: 'Power Bank 20000mAh — დისპლეით', category: 'phone',
    price: 60, oldPrice: 90, image: img('146c4180e'), rating: 4.7, stock: 12,
    desc: '20000mAh გარე აკუმულატორი ციფრული დისპლეით — 4–5 სრული დატენვა ერთი მუხტით.',
    specs: ['20000mAh, 22.5W სწრაფი დატენვა', 'LED დისპლეი', 'USB-C + 2× USB-A']
  },
  {
    id: 'p4', name: 'TWS უსადენო ყურსაცმელები ANC-ით', category: 'audio',
    price: 45, oldPrice: 59, image: img('59bc89f44'), rating: 4.6, stock: 30,
    desc: 'უსადენო ყურსაცმელები აქტიური ხმაურის ჩახშობით (ANC) და 30 საათამდე მუშაობის დროით.',
    specs: ['აქტიური ANC', '30 სთ ქეისით', 'Bluetooth 5.3, IPX5']
  },
  {
    id: 'p5', name: 'სტუდიური ყურსაცმელები პროფესიონალებისთვის', category: 'audio',
    price: 149, oldPrice: null, image: img('cf0931b85'), rating: 4.9, stock: 7,
    desc: 'სტუდიური ჩამკეტი ყურსაცმელები ბალანსირებული ხმით — მუშაობისა და მიქსისთვის.',
    specs: ['50mm დრაივერები', 'ჩამოსაკეცი კონსტრუქცია', '3.5mm + 6.3mm ადაპტერი']
  },
  {
    id: 'p6', name: 'პორტატული Bluetooth სპიკერი IPX7', category: 'audio',
    price: 62, oldPrice: 75, image: img('64a9be30b'), rating: 4.7, stock: 15,
    desc: 'წყალგამძლე Bluetooth სპიკერი 20W ხმით — გარეთ, სტუდიაში ან მოგზაურობაში.',
    specs: ['20W, სტერეო', 'IPX7 წყალგამძლეობა', '12 სთ ავტონომია']
  },
  {
    id: 'p7', name: 'სმარტ საათი AMOLED დისპლეით', category: 'watch',
    price: 95, oldPrice: 119, image: img('ef0530902'), rating: 4.8, stock: 20,
    desc: 'სმარტ საათი ნათელი AMOLED ეკრანით, სპორტული რეჟიმებითა და ჯანმრთელობის მონიტორინგით.',
    specs: ['1.43" AMOLED', 'SpO2, გულისცემა, ძილი', '10 დღე ავტონომია']
  },
  {
    id: 'p8', name: 'კლასიკური მექანიკური საათი ტყავის სამაჯურით', category: 'watch',
    price: 85, oldPrice: null, image: img('170820f86'), rating: 4.7, stock: 9,
    desc: 'კლასიკური მექანიკური საათი ტყავის სამაჯურით — ყოველდღიური და საოფისე სტილისთვის.',
    specs: ['ავტომატური მექანიზმი', 'ნატურალური ტყავი', '50მ წყალგამძლეობა']
  },
  {
    id: 'p9', name: 'ფიტნეს ბრასლეტი პულსმატერით', category: 'watch',
    price: 36, oldPrice: 45, image: img('79075e3f5'), rating: 4.5, stock: 26,
    desc: 'მსუბუქი ფიტნეს ბრასლეტი პულსმატერით, ნაბიჯების მთვლელითა და ძილის ანალიზით.',
    specs: ['ფერადი IPS ეკრანი', 'პულსი + ნაბიჯები', 'IP68, 7 დღე']
  },
  {
    id: 'p10', name: 'მინი LED პროექტორი Full HD', category: 'gadget',
    price: 165, oldPrice: 199, image: img('30b3b53f9'), rating: 4.6, stock: 6,
    desc: 'პორტატული Full HD პროექტორი — სახლის კინოთეატრი მხოლოდ 1 კვადრატულ მეტრზე.',
    specs: ['Full HD 1080p', 'HDMI + USB + Wi-Fi', '120" ეკრანამდე']
  },
  {
    id: 'p11', name: 'RGB LED ლენტი აპით მართვით', category: 'gadget',
    price: 32, oldPrice: null, image: img('9e67790ee'), rating: 4.5, stock: 40,
    desc: 'RGB LED ლენტი აპლიკაციით მართვით — 16 მილიონი ფერი და მუსიკის რეჟიმი.',
    specs: ['5 მეტრი, 16 მლნ ფერი', 'Wi-Fi + აპი', 'მუსიკის სინქრონიზაცია']
  },
  {
    id: 'p12', name: 'პორტატული მინი ვენტილატორი აკუმულატორით', category: 'gadget',
    price: 22, oldPrice: null, image: img('0018a0f5e'), rating: 4.4, stock: 34,
    desc: 'მობილური მინი ვენტილატორი ჩამონტაჟებული აკუმულატორით და სიჩქარის 3 რეჟიმით.',
    specs: ['3 სიჩქარე', '2000mAh აკუმულატორი', 'USB-C დატენვა']
  }
];

const DELIVERY_FEE = 5;
const FREE_DELIVERY_FROM = 150;

const ORDER_STEPS = [
  { key: 'received', label: 'შეკვეთა მიღებულია', note: 'ოპერატორი ამოწმებს შეკვეთას' },
  { key: 'processing', label: 'მუშავდება', note: 'პროდუქტი მზადდება გაგზავნისთვის' },
  { key: 'shipped', label: 'გზაშია', note: 'კურიერი მიგაქვთ შეკვეთას' },
  { key: 'delivered', label: 'მიწოდებულია', note: 'შეკვეთა გადმოგეცათ' }
];
