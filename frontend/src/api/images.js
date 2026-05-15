// Real images from Wikimedia Commons (CC BY-SA 4.0) and Unsplash (free to use)
// Wikimedia images credit: various photographers under CC BY-SA 4.0

export const IMAGES = {
  // Hero — Prashar Lake panorama, Mandi district
  hero: 'https://upload.wikimedia.org/wikipedia/commons/4/4f/Prashar_Lake_Mandi_Himachal_Nov20_D72_19097.jpg',

  // Overview grid
  prasharLake: 'https://upload.wikimedia.org/wikipedia/commons/4/4f/Prashar_Lake_Mandi_Himachal_Nov20_D72_19097.jpg',
  barotValley: 'https://upload.wikimedia.org/wikipedia/commons/7/71/Panoramic_view_of_Barot_Valley.jpg',
  uhlRiver: 'https://upload.wikimedia.org/wikipedia/commons/8/88/Uhl_River_at_Barot_Oct_2017_D72_2280.jpg',
  panchvaktraTemple: 'https://upload.wikimedia.org/wikipedia/commons/8/81/Panchvaktra_Temple%2C_Mandi.jpg',

  // Wildlife
  snowLeopard: 'https://upload.wikimedia.org/wikipedia/commons/3/37/Snow_Leopard_in_Padmaja_Naidu_Himalayan_Zoological_Park_%283%29.JPG',

  // Festival / Culture
  shivaratriFair: 'https://upload.wikimedia.org/wikipedia/commons/9/96/Mandi_Shivaratri_Fair.jpg',

  // Himachal Pradesh landscapes from Unsplash (free, no attribution required)
  himachalForest: 'https://images.unsplash.com/photo-1581791534721-e599df4417f7?w=1200&q=80',
  himachalRiver: 'https://images.unsplash.com/photo-1652501834567-937de29c4533?w=1200&q=80',
  himachalMountain: 'https://images.unsplash.com/photo-1609920658906-8223bd289001?w=1200&q=80',
  himachalTrekking: 'https://images.unsplash.com/photo-1597074866923-dc0589150358?w=1200&q=80',
  himachalCamping: 'https://images.unsplash.com/photo-1503265192943-9d7eea6fc77a?w=1200&q=80',
  himachalParagliding: 'https://images.unsplash.com/photo-1620720970374-5b7e67e1e610?w=1200&q=80',

  // Package images
  packages: [
    'https://images.unsplash.com/photo-1503265192943-9d7eea6fc77a?w=800&q=80',  // camping/homestay
    'https://images.unsplash.com/photo-1620720970374-5b7e67e1e610?w=800&q=80',  // adventure/paragliding
    'https://images.unsplash.com/photo-1597074866923-dc0589150358?w=800&q=80',  // resort/landscape
  ],

  // Article images mapped by category
  articleImages: {
    trekking: 'https://upload.wikimedia.org/wikipedia/commons/4/4f/Prashar_Lake_Mandi_Himachal_Nov20_D72_19097.jpg',
    culture: 'https://upload.wikimedia.org/wikipedia/commons/9/96/Mandi_Shivaratri_Fair.jpg',
    wildlife: 'https://upload.wikimedia.org/wikipedia/commons/3/37/Snow_Leopard_in_Padmaja_Naidu_Himalayan_Zoological_Park_%283%29.JPG',
    guides: 'https://upload.wikimedia.org/wikipedia/commons/8/88/Uhl_River_at_Barot_Oct_2017_D72_2280.jpg',
    history: 'https://upload.wikimedia.org/wikipedia/commons/8/81/Panchvaktra_Temple%2C_Mandi.jpg',
  },
}

export function getArticleImage(category, id) {
  return IMAGES.articleImages[category] || IMAGES.himachalMountain
}

export function getPackageImage(index) {
  return IMAGES.packages[index % IMAGES.packages.length]
}
