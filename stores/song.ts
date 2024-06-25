import { defineStore } from "pinia";

export interface Song {
  id: number;
  title: string;
  artist: string;
  duration: number;
}

export const useSongStore = defineStore("todo", {
  state: () => {
    return {
      fetching: false,
      paused: true,
      progress: 0,
      currentSong: {
        id: 0,
        title: "",
        artist: "",
        duration: 0,
      } as Song,
      list: [] as Song[],
    };
  },
  getters: {
    currentIndex(state): number {
      return this.list.findIndex((song) => song.id === state.currentSong.id);
    },
    active(state) {
      return (song: any) =>
        state.currentSong && state.currentSong.id === song.id;
    },
  },

  actions: {
    async fetchSongs(shuffle: boolean = false) {
      if(this.fetching) return;
      this.fetching = !this.fetching;
      const { data } = await useAsyncData("register", () => {
        const client = useSanctumClient();
        return client("/api/playlist", {
          method: "GET",
          params: {
            shuffle: shuffle,
          },
        });
      });
      this.list = data.value.data;
      this.setCurrentSong(this.list[0]);
      this.fetching = !this.fetching;
    },
    pause(stop: boolean) {
      this.paused = stop;
    },
    prevSong() {
      const index = this.list.findIndex(
        (song) => song.id === this.currentSong.id
      );

      if (index === 0) {
        this.setCurrentSong(this.list[0]);
        return;
      }
      this.setCurrentSong(this.list[index === -1 ? 0 : index - 1]);
    },
    nextSong() {
      const index = this.list.findIndex(
        (song) => song.id === this.currentSong.id
      );

      if (index === this.list.length - 1) {
        this.setCurrentSong(this.list[index]);
        return;
      }
      this.setCurrentSong(this.list[index === -1 ? 0 : index + 1]);
    },
    updateProgress(progress: number) {
      this.progress += progress;
    },
    setCurrentSong(song: any) {
      this.paused = false;
      this.currentSong = song;
      this.progress = 0;
    },
  },
});
