// Function to fetch iframe links from API
export const fetchIframes = async (urls) => {
  try {
    const response = await fetch(
      "https://microservices-pink.vercel.app/api/scrapCharts",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ urls }),
      }
    );

    if (!response.ok) {
      throw new Error("Failed to fetch data");
    }

    const data = await response.json();
    return data.results?.flatMap((item) => item.iframes) || [];
  } catch (error) {
    console.error("Error fetching iframes:", error);
    return [];
  }
};

// Function to extract domain from URL
export const getDomain = (url) => {
  try {
    return new URL(url).hostname; // Extracts domain (e.g., "indiaspend.com")
  } catch {
    return url; // Fallback if URL parsing fails
  }
};

export const fetchMetadataFromApi = async (urls) => {
  try {
    // Convert the URLs array into a JSON string
    const urlParam = JSON.stringify(urls);

    // Make the API call
    const response = await fetch(
      `https://toolbox.boomlive.in/api_project/mediator_vue.php?get_metadata_from_arr=${encodeURIComponent(
        urlParam
      )}`
    );

    if (response.ok) {
      // Parse and return the JSON response
      return await response.json();
    } else {
      throw new Error(`Failed to fetch metadata: ${response.statusText}`);
    }
  } catch (error) {
    console.error("Error fetching metadata from API:", error);
    throw error; // Re-throw the error for the calling code to handle
  }
};

// Function to fetch metadata (title) of a given URL using API
export const fetchMetaTitle = async (url) => {
  try {
    console.log("Fetching metadata for URL:", url);

    // Call the API with a single URL wrapped in an array
    const metadata = await fetchMetadataFromApi([url]);
    console.log("metadata", metadata);

    // Extract title from the response
    const title = metadata?.final_response?.[0]?.title || "No Title Found";
    console.log("title", title);

    return title;
  } catch (error) {
    return url;
  }
};
// function addUtmToUrl(url) {
export const addUtmToUrl = (url) => {
  try {
    let urlObj = new URL(url);

    // 🔹 Remove trailing `/` only if it's at the end of the pathname (not in query)
    urlObj.pathname = urlObj.pathname.replace(/\/$/, "");

    // 🔹 Use URLSearchParams to modify query parameters safely
    let params = new URLSearchParams(urlObj.search);
    params.set("utm_source", "ask_indiaspend"); // Overwrite if exists

    // 🔹 Set updated search params
    urlObj.search = params.toString();

    return urlObj.toString();
  } catch (error) {
    console.error("Invalid URL:", url);
    return url;
  }
};

export const sortByPublishedTime = (articles) => {
  return articles.sort(
    (a, b) => new Date(b.published_time) - new Date(a.published_time)
  );
};

export const getMostRelevantIframeIndex = (question, iframeData) => {
  // Ensure iframeData has a valid final_response array
  if (!iframeData || !iframeData.final_response || iframeData.final_response.length === 0) {
    return -1; // No valid iframes available
  }

  // Split the question into words (converted to lowercase)
  const questionWords = question.toLowerCase().split(/\s+/);

  let bestIndex = 0;
  let highestMatchCount = 0;

  // Iterate over each iframe object in the final_response array
  iframeData.final_response.forEach((iframe, index) => {
    const title = iframe.title || "";
    const titleLower = title.toLowerCase();
    let matchCount = 0;

    // Count the matching words in the title
    questionWords.forEach((word) => {
      if (titleLower.includes(word)) {
        matchCount++;
      }
    });

    // Update bestIndex if current title has more matching words
    if (matchCount > highestMatchCount) {
      highestMatchCount = matchCount;
      bestIndex = index;
    }
  });

  // Return the index of the best matching iframe title
  return bestIndex;
};


export const fetchMetaTitlesFromApi = async (urls) => {
  try {
    // Convert the URLs array into a JSON string
    const urlParam = JSON.stringify(urls);

    // Make the API call
    const response = await fetch(
      `https://toolbox.boomlive.in/api_project/mediator_vue.php?get_metatitle_from_arr=${encodeURIComponent(
        urlParam
      )}`
    );

    if (response.ok) {
      // Parse and return the JSON response
      return await response.json();
    } else {
    }
  } catch (error) {
    console.error("Error fetching meta titles from API:", error);
    throw error; // Re-throw the error for the calling code to handle
  }
};




// export const fetchTopicWiseQuestions = async (topic) => {
//   setLoading(true);
//   try {
//     const response = await fetch(
//       `https://toolbox.boomlive.in/api_project/indiaspendtemp.php?pulljson2=true&queType=${topic}`,
//       { method: "GET", headers: { "Content-Type": "application/json" } }
//     );

//     if (!response.ok) {
//       throw new Error("Failed to fetch questions");
//     }
 
//     const data = await response.json();
//     const cleanedQuestions = data.latest_json.questions.map(cleanQuestion);
//     const nonEmptyQuestions = cleanedQuestions.filter((q) => q !== "");
//     setQuestionsSet(nonEmptyQuestions);
//     const randomQuestions = getRandomQuestions(nonEmptyQuestions, 4);
//     setQuestions(randomQuestions);
//   } catch (error) {
//     setError("Error fetching questions");
//   } finally {
//     setLoading(false);
//   }
// };
export const getRandomQuestions = (questionsArray, count) => {
  const randomQuestions = [];
  const questionsCopy = [...questionsArray];

  for (let i = 0; i < count; i++) {
    if (questionsCopy.length === 0) break;
    const randomIndex = Math.floor(Math.random() * questionsCopy.length);
    randomQuestions.push(questionsCopy.splice(randomIndex, 1)[0]);
  }

  return randomQuestions;
};

export const cleanQuestion = (question) => {
  return question
    .replace(/^Article\s*\d*: \s*/, "")
    .replace(/^- /, "")
    .trim();
};
