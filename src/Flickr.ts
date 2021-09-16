import FetchProxy from './FetchProxy';

type FlickrPhotosSearch = {
  method: string;
  user_id: string | null;
  tags: string | null;
  tag_mode: string | null;
  text: string | null;
  min_upload_date: Date | null;
  max_upload_date: Date | null;
  min_taken_date: Date | null;
  max_taken_date: Date | null;
  license: string | null;
  machine_tags: string | null;
  page: number;
  per_page: number;
  geo_context: string | null;
};

type PhotoProps = {
  id: string;
  owner?: string;
  farm?: string;
  secret?: string;
  server?: string;
  title: string;
  ispublic?: string;
  isfriend?: string;
  isfamily?: string;
};

type Photo = {
  photo: Array<PhotoProps>;
};

interface FlickrParams {
  search: FlickrPhotosSearch;
}

interface FlickrResponse extends Response {
  photos: Photo;
}

class Flickr {

  name: string;
  url: string;
  api_key: string;
  paginationDepth: number;
  params: FlickrParams;

  constructor(api_key: string) {
    this.name = 'flickr';
    this.url = 'https://www.flickr.com/services/rest/?';
    this.api_key = api_key;
    this.paginationDepth = 3;

    this.params = {
      search: {
        method: 'flickr.photos.search',
        user_id: null,
        tags: null,
        tag_mode: null,
        text: null,
        min_upload_date: null,
        max_upload_date: null,
        min_taken_date: null,
        max_taken_date: null,
        license: null,
        machine_tags: null,
        page: 1,
        per_page: 500,
        geo_context: null,
      },
    };
  }

  generateURL(params?: string | number | boolean): string {
    let queryString = '';

    if (params) {
      this.params['search'].text = encodeURIComponent(params);
      this.params['search'].tags = encodeURIComponent(params);
    }

    for (const [key, value] of Object.entries(this.params['search'])) {
      if (value) {
        queryString += `${key}=${value}`.concat('&');
      }
    }

    queryString =
      queryString.slice(0, queryString.length - 1) +
      '&api_key=' +
      this.api_key +
      '&format=json&nojsoncallback=1';

    const url = this.url + queryString;

    return url;
  }

  async searchByName(params: any) {
    const url = this.generateURL(params);
    const data = await FetchProxy.getJsonResponse(url);
    const flickrResList = this.processResponse(data as FlickrResponse);

    const response = await this.addPaginatedResponse(flickrResList);
    return response;
  }

  async addPaginatedResponse(resp: any[]) {
    //end recursion
    if (this.params['search'].page === this.paginationDepth + 1) return;
    // recursion
    this.params['search'].page += 1;
    const url = this.generateURL();

    const res = (await FetchProxy.getJsonResponse(url)) as FlickrResponse;
    res.photos.photo.forEach(
      (item: PhotoProps) => {
        resp.push({
          id: 'fl' + item.id,
          name: item.title,
          src: `https://farm${item.farm}.staticflickr.com/${item.server}/${item.id}_${item.secret}.jpg`,
        });
      }
    );
    await this.addPaginatedResponse(resp);
  }

  processResponse(response: { photos: any }) {
    const imageList: { id: string; name: any; src: string }[] = [];
    const results = response.photos;
    const images = results.photo;
    images.forEach(
      (item: {
        id: string;
        title: any;
        farm: any;
        server: any;
        secret: any;
      }) => {
        imageList.push({
          id: 'fl' + item.id,
          name: item.title,
          src: `https://farm${item.farm}.staticflickr.com/${item.server}/${item.id}_${item.secret}.jpg`,
        });
      }
    );
    return imageList;
  }
}

export default Flickr;