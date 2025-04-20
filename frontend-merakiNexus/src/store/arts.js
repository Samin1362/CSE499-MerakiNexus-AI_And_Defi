import { create } from "zustand";

export const useArt = create((set) => ({
  arts: [],
  daoInfo: null,
  hostGallery: [],
  artist: null, 
  setArts: (arts) => set({ arts }),
  setDaoInfo: (daoInfo) => set({ daoInfo }),
  setHostGallery: (hostGallery) => set({ hostGallery }),
  setArtist: (artist) => set({ artist }),

  fetchArts: async () => {
    try {

      // Use environment variable for dynamic API URL
      const apiUrl = process.env.REACT_APP_API_URL || "http://localhost:5001";  // Fallback to local URL if the environment variable is not set

      //https://cse499-merakinexus-ai-and-defi.onrender.com
      const res = await fetch("https://cse499-merakinexus-ai-and-defi.onrender.com/artist/api/art", {
        method: "GET", 
        headers: {
          "Content-Type": "application/json", 
        }, 
        credentials: "include",
      });

      if (!res.ok) {
        throw new Error('Failed to fetch arts');
      }

      const data = await res.json();

      if (data.success) {
        set({ arts: data.data });
      } else {
        console.error("Error fetching data:", data.message);
      }
      } catch (error) {
        console.error("Error fetching arts:", error);
      }
  },
  deleteArt: async (pid) => {
    const res = await fetch(`https://cse499-merakinexus-ai-and-defi.onrender.com/artist/api/art/${pid}`, {
        method: "DELETE",
    });
    const data = await res.json();
    if(!data.success) return { success: false, message: data.message};

    // update the ui immediately, without needing a refresh
    set((state) => ({ arts: state.arts.filter((art) => art._id !== pid)}));

    return { success: true, message: data.message }
  },
  createArt: async (newArt) => {
    if (!newArt.name || !newArt.descriptionByArtist || !(newArt.image || newArt.imageUrl)) {
      return { success: false, message: "Invalid Input" };
    }
  
    // Create a FormData object to send the image as part of the request body
    const formData = new FormData();
  
    // Append all form data (including the image file) to FormData
    formData.append("name", newArt.name);
    formData.append("descriptionByArtist", newArt.descriptionByArtist);
    formData.append("imageUrl", newArt.imageUrl);
    formData.append("image", newArt.image);  // 'image' should be a file object
  
    const res = await fetch("http://localhost:5001/artist/api/upload", {
      method: "POST",
      body: formData,  // Use FormData as the body
    });
  
    const data = await res.json();
    return data;
  }, 
  fetchInfo: async () => {
    try {
      const res = await fetch("https://cse499-merakinexus-ai-and-defi.onrender.com/dao/api/info", {
        method: "GET", 
        headers: {
          "Content-Type": "application/json", 
        }, 
        credentials: "include",
      });

      if (!res.ok) {
        throw new Error("Failed to fetch DAO info");
      }

      const data = await res.json();

      if (data.success) {
        set({ daoInfo: data.data }); // Update daoInfo in the store
      } else {
        console.error("Error fetching daoInfo:", data.message);
      }
    } catch (error) {
      console.error("Error fetching daoInfo:", error);
    }
  },
  fetchArtist: async () => {
    try {
      const res = await fetch("https://cse499-merakinexus-ai-and-defi.onrender.com/artist/api/art/artistInfo", {
        method: "GET", 
        headers: {
          "Content-Type": "application/json", 
        }, 
        credentials: "include",
      });

      if (!res.ok) {
        throw new Error("Failed to fetch Artist info");
      }

      const data = await res.json();

      if (data.success) {
        set({ artist: data.data }); // Update artist in the store
      } else {
        console.error("Error fetching Artist Info:", data.message);
      }
    } catch (error) {
      console.error("Error fetching Artist Info:", error);
    }
  },
  fetchHostGallery: async () => {

    const res = await fetch("https://cse499-merakinexus-ai-and-defi.onrender.com/host/api", {
      method: "GET", 
      headers: {
        "Content-Type": "application/json", 
      }, 
      credentials: "include",
    });


    if (!res.ok) {
      throw new Error('Failed to fetch arts');
    }

    const data = await res.json();

    if (data.success) {
      set({ hostGallery: data.data });
    } else {
      console.error("Error fetching data:", data.message);
    }
    
  },
  transferArt: async (pid) => {
    const res = await fetch(`http://localhost:5001/artist/api/art/transaction/transfer/${pid}`, {
      method: "PATCH",
    })

    const data = await res.json(); 
    if(!data.success) return { success: false, message: data.message}

    // update the ui immediately, without needing a refresh
    set((state) => ({ arts: state.arts.filter((art) => art._id !== pid)}));

    return {success: true, message: data.message};
  },
}));
