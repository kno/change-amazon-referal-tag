let tag: string = "";

chrome.storage.onChanged.addListener(function (changes, namespace) {
  chrome.storage.sync.get("tags", (data) => {
    console.log("prev data")
    if (data?.tags?.length) {
      console.log("after data")
      console.log("tags", data.tags);
      tag = data.tags.find((tag) => tag.selected)?.name || "";
      console.log(tag);
      updateRules();
    }
  });
});

const amazonURLs = [
  "*://*.amazon.ae/*",
  "*://*.amazon.at/*",
  "*://*.amazon.ca/*",
  "*://*.amazon.cn/*",
  "*://*.amazon.co.jp/*",
  "*://*.amazon.co.uk/*",
  "*://*.amazon.com.au/*",
  "*://*.amazon.com.br/*",
  "*://*.amazon.com.mx/*",
  "*://*.amazon.com.sg/*",
  "*://*.amazon.com.tr/*",
  "*://*.amazon.com/*",
  "*://*.amazon.de/*",
  "*://*.amazon.eg/*",
  "*://*.amazon.es/*",
  "*://*.amazon.fr/*",
  "*://*.amazon.ie/*",
  "*://*.amazon.in/*",
  "*://*.amazon.it/*",
  "*://*.amazon.nl/*",
  "*://*.amazon.pl/*",
  "*://*.amazon.se/*",
  "*://*.amazon.sg/*",
];

const updateRules = () => {
  chrome.declarativeNetRequest.updateDynamicRules(
    {
      removeRuleIds: [1, 2],
    },
    () => {
      if (chrome.runtime.lastError)
        console.log("update error", chrome.runtime.lastError);
    }
  );
  chrome.declarativeNetRequest.updateDynamicRules(
    {
      addRules: [
        {
          id: 2,
          priority: 1,
          action: {
            type: "redirect",
            redirect: {
              transform: {
                queryTransform: {
                  addOrReplaceParams: [
                    {
                      key: "tag",
                      value: tag,
                    },
                  ],
                },
              },
            },
          },
          condition: {
            regexFilter: ".*\.amazon\..*/(dp|deal)/.*",
            resourceTypes: ["main_frame"],
          },
        },
      ],
    },
    () => {
      console.log("rules updated", tag);
      if (chrome.runtime.lastError)
        console.log("update error", chrome.runtime.lastError);
    }
  );
};
