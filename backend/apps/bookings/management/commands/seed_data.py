from django.core.management.base import BaseCommand
from django.contrib.auth import get_user_model
from apps.bookings.models import Package
from apps.content.models import Article

User = get_user_model()


class Command(BaseCommand):
    help = 'Seed the database with Uttarshall Valley sample data'

    def handle(self, *args, **options):
        self._create_admin()
        self._create_packages()
        self._create_articles()
        self.stdout.write(self.style.SUCCESS('Seed data created successfully!'))

    def _create_admin(self):
        if not User.objects.filter(username='admin').exists():
            User.objects.create_superuser(
                username='admin',
                email='admin@uttarshallvalley.in',
                password='admin123',
                first_name='Valley',
                last_name='Admin',
            )
            self.stdout.write('  Created superuser: admin / admin123')

    def _create_packages(self):
        packages = [
            {
                'name': 'Himalayan Explorer',
                'duration_days': 3,
                'price': 4999,
                'highlights': [
                    'Prashar Lake sunrise trek',
                    'Beas riverside camping',
                    'Local Himachali dinner',
                    'Valley viewpoint hike',
                ],
                'accommodation': 'Mountain Homestay',
                'featured': False,
            },
            {
                'name': 'Adventure Seeker',
                'duration_days': 5,
                'price': 9999,
                'highlights': [
                    'Barot Valley exploration',
                    'Uhl river white-water rafting',
                    'Wildlife trail — Himalayan brown bear habitat',
                    'Trout fishing at Barot',
                    'Stargazing camp at 2,800m',
                ],
                'accommodation': 'Luxury Tent Camp',
                'featured': True,
            },
            {
                'name': 'Ultimate HP Experience',
                'duration_days': 7,
                'price': 16999,
                'highlights': [
                    'All Adventure Seeker activities',
                    'Shikari Devi temple trek (3,359m)',
                    'Jogindernagar heritage walk',
                    'Village homestay with Gaddi family',
                    'Paragliding over Mandi valley',
                    'Professional photography guide',
                ],
                'accommodation': 'Premium Mountain Resort',
                'featured': False,
            },
        ]
        for data in packages:
            Package.objects.get_or_create(name=data['name'], defaults=data)
        self.stdout.write(f'  Created {len(packages)} packages')

    def _create_articles(self):
        admin = User.objects.get(username='admin')
        articles = [
            {
                'title': 'Prashar Lake: The Floating Island Trek',
                'excerpt': 'A mesmerizing high-altitude lake with a mysterious floating island, nestled at 2,730m in the Mandi district of Himachal Pradesh.',
                'body': (
                    'Prashar Lake is one of the most enchanting destinations in Himachal Pradesh, located at an altitude of 2,730 metres above sea level in the Mandi district. '
                    'The lake is famous for its mysterious floating island that drifts around the lake with the wind and currents. '
                    'The trek to Prashar Lake starts from Baggi village, approximately 49 km from Mandi town. '
                    'The trail winds through dense deodar cedar forests and open meadows called "bugyals" that burst with wildflowers in summer. '
                    'A 14th-century pagoda-style temple dedicated to the sage Prashar stands at the lake\'s shore, adding a cultural dimension to the trek. '
                    'The best time to visit is May to October. Winter visits (December to February) offer a frozen lake experience but require experience with snow trekking. '
                    'From Mandi, shared taxis and buses run to Baggi. The trek itself takes 3-4 hours one way and is rated moderate. '
                    'Camping is allowed near the lake. Basic facilities are available at the HRTC rest house near the temple.'
                ),
                'category': 'trekking',
                'read_time': 8,
            },
            {
                'title': 'Mandi Shivratri: The International Fair of Gods',
                'excerpt': 'Every February, over 200 local deities descend to Mandi town for a week-long celebration — one of India\'s most unique religious festivals.',
                'body': (
                    'The Mandi Shivratri fair, also called the "Kullu Dussehra of Mandi," is a spectacular week-long festival held every February in Mandi town. '
                    'Over 200 local deities (devtas) from across the Mandi district are brought to the town in elaborate palanquins called "raths." '
                    'The festival celebrates Lord Shiva and draws thousands of devotees and tourists from across India and the world. '
                    'The fair features folk music, traditional Nati dances (the folk dance of Himachal Pradesh), handicraft stalls, and agricultural exhibitions. '
                    'The main procession on Shivratri day, when all the deities converge at the historic Tarna Hill temple, is a breathtaking spectacle. '
                    'Mandi town itself is known as the "Varanasi of the Hills" for its 81 ancient stone temples along the Beas river. '
                    'During the fair, hotels in Mandi are heavily booked. Visitors should plan accommodation in advance or stay in nearby Sundernagar or Pandoh. '
                    'The fair is held at the historic Paddal Ground near the Beas river and is free to attend.'
                ),
                'category': 'culture',
                'read_time': 7,
            },
            {
                'title': 'Wildlife of Uttarshall Valley: Snow Leopard & Monal',
                'excerpt': 'Discover the incredible biodiversity of Mandi district — from the elusive snow leopard to the vibrant Himalayan monal pheasant.',
                'body': (
                    'The Uttarshall Valley region in Mandi district is a biodiversity hotspot in the Western Himalayas. '
                    'The valley sits at elevations ranging from 800m to over 4,000m, creating diverse ecosystems that support an extraordinary range of wildlife. '
                    'The Himalayan monal (Lophophorus impejanus), the state bird of Himachal Pradesh, is frequently spotted in the oak and rhododendron forests between 2,500m and 4,000m. '
                    'Snow leopards (Panthera uncia) inhabit the higher reaches above 3,500m. Though elusive, their pugmarks and kills are evidence of their presence in the Shikari Devi forest range. '
                    'Himalayan brown bears are more commonly seen, especially in the Barot Valley forests during autumn when they forage before hibernation. '
                    'Other notable species include the Himalayan tahr, barking deer (muntjac), Indian pangolin, and over 200 species of birds. '
                    'The Shikari Devi Wildlife Sanctuary, covering 7,000 hectares in the Jogindernagar subdivision, offers protected habitat for most of these species. '
                    'Wildlife sightings are best during early morning walks and late evenings. Guides from local villages can significantly improve your chances of spotting wildlife.'
                ),
                'category': 'wildlife',
                'read_time': 9,
            },
            {
                'title': 'Best Trout Fishing Spots in Barot Valley',
                'excerpt': 'Barot Valley on the Uhl river is Himachal Pradesh\'s premier trout fishing destination, with a government fish farm established in 1906.',
                'body': (
                    'Barot Valley, located 65 km from Mandi town at an elevation of 1,600m, is one of the most scenic and serene valleys in Himachal Pradesh. '
                    'The Uhl river that flows through Barot is renowned for its crystal-clear waters and thriving population of brown trout (Salmo trutta). '
                    'The Government Trout Farm at Barot, established during the British era in 1906, is one of the oldest in Asia and still supplies trout to rivers across Himachal Pradesh. '
                    'Fishing permits are required and can be obtained from the Himachal Pradesh Fisheries Department office in Mandi or at the Barot rest house. '
                    'The fishing season runs from March 1 to October 31. No fishing is permitted during November and February (spawning season). '
                    'The most productive stretches are upstream from the fish farm, where the river flows through dense forest. '
                    'Fly fishing and spin casting are both popular. Local guides who know the best pools and runs can be hired in Barot village for around ₹500 per day. '
                    'Barot also offers excellent camping on the river banks, apple orchid walks, and day hikes to Nargu Wildlife Sanctuary.'
                ),
                'category': 'guides',
                'read_time': 6,
            },
            {
                'title': 'History of Mandi: The Temple Town of Himachal',
                'excerpt': 'With 81 ancient stone temples and a history spanning 500 years, Mandi is the cultural and spiritual heart of Himachal Pradesh.',
                'body': (
                    'Mandi, the district headquarters and principal town of Mandi district, has a history stretching back to the 15th century when the Mandi kingdom was founded by Sen dynasty rulers. '
                    'The town was established along the Beas river around 1527 CE by Raja Ajbar Sen. '
                    'Known as the "Varanasi of the Hills," Mandi has 81 ancient stone temples, many of which date to the 16th and 17th centuries. '
                    'The Trilokinath and Panchvaktra temples are masterpieces of medieval Himachali temple architecture, featuring intricate stone carvings and shikhara towers. '
                    'The Mandi royal family ruled the kingdom for over 400 years until the princely state merged with the Indian Union in 1948. '
                    'The Raj Mahal palace and the Victorian colonial bungalows around the town reflect the complex layering of indigenous and British colonial history. '
                    'Mandi serves as the gateway to the Kullu valley, Lahaul, and Spiti. The Grand Trunk Road (later National Highway 3) made it a vital trading post for caravans crossing the high passes. '
                    'The Uhl and Beas rivers that meet at Mandi have powered the Shanan hydro-electric project since 1932, one of India\'s earliest hydropower plants.'
                ),
                'category': 'history',
                'read_time': 10,
            },
            {
                'title': 'River Rafting on the Uhl: Beginner\'s Complete Guide',
                'excerpt': 'The Uhl river offers thrilling Grade II-III rapids through forested gorges near Barot — perfect for first-time rafters visiting Himachal Pradesh.',
                'body': (
                    'The Uhl river, a tributary of the Beas originating from the Kullu side of the Rohtang Pass area, offers some of the most accessible white-water rafting in Himachal Pradesh. '
                    'The rafting stretch near Barot covers approximately 14 km and features Grade II and III rapids, making it ideal for beginners and intermediate rafters. '
                    'The best season for rafting is July to September when the monsoon snowmelt keeps the river at optimal levels. '
                    'Rafting operators in Barot provide all safety equipment including helmets, life jackets, and dry bags. Charges typically range from ₹800 to ₹1,500 per person for a full stretch. '
                    'No prior experience is required for the Barot stretch. Operators provide a 20-minute safety briefing before the run. '
                    'The river passes through dense deodar and pine forests, with occasional sightings of Himalayan griffon vultures and brahminy ducks. '
                    'Longer expeditions of 2-3 days with riverside camping can be arranged through adventure tour operators in Mandi or Barot. '
                    'Important: Always raft with AORE (Adventure Operators Rating and Evaluation) certified operators. Check for government safety certification before booking.'
                ),
                'category': 'guides',
                'read_time': 7,
            },
        ]
        count = 0
        for data in articles:
            if not Article.objects.filter(title=data['title']).exists():
                Article.objects.create(author=admin, **data)
                count += 1
        self.stdout.write(f'  Created {count} articles')
