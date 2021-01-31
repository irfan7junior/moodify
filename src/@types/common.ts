export interface Track {
  album: Album
  artists: Artist[]
  disc_number: number
  duration_ms: number
  explicit: boolean
  external_ids: ExternalIDS
  external_urls: ExternalUrls
  href: string
  id: string
  is_local: boolean
  is_playable: boolean
  name: string
  popularity: number
  preview_url: string
  track_number: number
  type: TrackType
  uri: string
}

interface Album {
  album_type: AlbumType
  artists: Artist[]
  external_urls: ExternalUrls
  href: string
  id: string
  images: Image[]
  name: string
  release_date: string
  release_date_precision: ReleaseDatePrecision
  total_tracks: number
  type: AlbumTypeEnum
  uri: string
}

enum AlbumType {
  Album = 'ALBUM',
  Single = 'SINGLE',
}

interface Artist {
  external_urls: ExternalUrls
  href: string
  id: string
  name: string
  type: ArtistType
  uri: string
}

interface ExternalUrls {
  spotify: string
}

enum ArtistType {
  Artist = 'artist',
}

interface Image {
  height: number
  url: string
  width: number
}

enum ReleaseDatePrecision {
  Day = 'day',
}

enum AlbumTypeEnum {
  Album = 'album',
}

interface ExternalIDS {
  isrc: string
}

enum TrackType {
  Track = 'track',
}
