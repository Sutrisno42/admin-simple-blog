export function pageLinks(links) {
    return links.map((e) => {
      if (e.label === '&laquo; Previous') {
        return { ...e, label: '<' }
      } else if (e.label === 'Next &raquo;') {
        return { ...e, label: '>' }
      }
      return e
    })
  }
  