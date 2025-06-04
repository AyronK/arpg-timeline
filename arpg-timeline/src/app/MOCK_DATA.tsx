export const MOCK_DATA = {
    games: {
        edges: [
            {
                node: {
                    frontmatter: {
                        slug: "diablo-iii",
                        name: "Diablo III",
                        shortName: "D3",
                        official: true,
                        seasonKeyword: "season",
                        url: "https://diablo3.blizzard.com/",
                        group: "Diablo Official",
                        logo: {
                            childImageSharp: {
                                gatsbyImageData: {
                                    layout: "constrained",
                                    placeholder: {
                                        fallback:
                                            "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAANCAYAAACpUE5eAAAACXBIWXMAAAsTAAALEwEAmpwYAAAB+0lEQVR42mNgIAIcXrpUcNvEiewMZABGGOM/kP2/vp7p////zKtmVSuumjKFB8hmrAeKkWQixBCIYSD+zhV91ssmFfQumlycuHPnIm6YGhANNRy7JatCQ5kX19fzraoPZQPzp2TxLOhNN9u5pGXJ/vVdtYc2Tly6ZmZVTlqaC//++noWsJr6erb59fkCKAbBTN8/q8Xi+NrpXUeW9eXun9+qsbYn2296XVL0+gnlT3tTvS4ubMh6vGZC2ZKpZTFWu+c3e4D0bJ/RWHRiw+zCC1vmg/mrVq1ihjv/SGuw7d6O0KlLq0JLt/Wk2ayqCY1a25jsOrck5GNXuNe/5giX/0uqQmfsbE8xXlUd3NWdlCS/pyumbGWFd/nhWSVx4KBYFcoMj4h2b13BGUlWJpMrAoQ31adx5ZmY6LS4G7dPC7O8Mi80YM7qaLdNU/1tJ2abWrr3BZko7d8/n2NdtqlwH1CPvT0DC+5IgVgAtqTAWEOy3kxt3RRLnQXrnPVXL3IzjUZSQyB2gTG7v96epb6eARJzDGCaYUecS2aLmfrixU4m066FO6uBwxuoDqYHFJnEJyGgwW9WLZBuNlEOn+tibXMiN5ePaBfiNPDWLZk+a33tXZ31Uv/+/SMrt6DkHGDu4D2xdq3Mmd27+YFsJgZqgE9Pb4icOXOGlRjFAF4t2SMUI57dAAAAAElFTkSuQmCC",
                                    },
                                    images: {
                                        fallback: {
                                            src: "/static/bc3d7b0aa5298684eb6ecfa48fdbd068/df421/diablo_3_logo.png",
                                            srcSet: "/static/bc3d7b0aa5298684eb6ecfa48fdbd068/c1e8d/diablo_3_logo.png 134w,\n/static/bc3d7b0aa5298684eb6ecfa48fdbd068/890ab/diablo_3_logo.png 268w,\n/static/bc3d7b0aa5298684eb6ecfa48fdbd068/df421/diablo_3_logo.png 536w",
                                            sizes: "(min-width: 536px) 536px, 100vw",
                                        },
                                        sources: [
                                            {
                                                srcSet: "/static/bc3d7b0aa5298684eb6ecfa48fdbd068/2fa69/diablo_3_logo.webp 134w,\n/static/bc3d7b0aa5298684eb6ecfa48fdbd068/25109/diablo_3_logo.webp 268w,\n/static/bc3d7b0aa5298684eb6ecfa48fdbd068/154df/diablo_3_logo.webp 536w",
                                                type: "image/webp",
                                                sizes: "(min-width: 536px) 536px, 100vw",
                                            },
                                        ],
                                    },
                                    width: 536,
                                    height: 357,
                                },
                            },
                        },
                    },
                },
            },
            {
                node: {
                    frontmatter: {
                        slug: "diablo-iv",
                        name: "Diablo IV",
                        shortName: "D4",
                        official: true,
                        seasonKeyword: "season",
                        url: "https://diablo4.blizzard.com/",
                        group: "Diablo Official",
                        logo: {
                            childImageSharp: {
                                gatsbyImageData: {
                                    layout: "constrained",
                                    placeholder: {
                                        fallback:
                                            "data:image/heif;base64,AAAAHGZ0eXBhdmlmAAAAAGF2aWZtaWYxbWlhZgAAAZhtZXRhAAAAAAAAACFoZGxyAAAAAAAAAABwaWN0AAAAAAAAAAAAAAAAAAAAAA5waXRtAAAAAAABAAAANGlsb2MAAAAAREAAAgACAAAAAAG8AAEAAAAAAAAAYgABAAAAAAIeAAEAAAAAAAAA1wAAADhpaW5mAAAAAAACAAAAFWluZmUCAAAAAAEAAGF2MDEAAAAAFWluZmUCAAAAAAIAAGF2MDEAAAAA12lwcnAAAACxaXBjbwAAABNjb2xybmNseAACAAIABoAAAAAMYXYxQ4EAHAAAAAAUaXNwZQAAAAAAAAAUAAAACQAAAA5waXhpAAAAAAEIAAAAOGF1eEMAAAAAdXJuOm1wZWc6bXBlZ0I6Y2ljcDpzeXN0ZW1zOmF1eGlsaWFyeTphbHBoYQAAAAAMYXYxQ4EgAgAAAAAUaXNwZQAAAAAAAAAUAAAACQAAABBwaXhpAAAAAAMICAgAAAAeaXBtYQAAAAAAAAACAAEEgYYHiAACBIIDhIUAAAAaaXJlZgAAAAAAAAAOYXV4bAACAAEAAQAAAUFtZGF0EgAKBRgQ5wwqMlcYABBBQO1G2r4euRptshzfzkBxcDoOkxLrxPohy8A2fX4afg2jDWhhKXlJ6DgQdV4Y/B1kKA7tLphZoDkYdsoRL8QRLZo9RQE3gJSDzLWzUVxUpgrANYASAAoFOBDnDBIyywEYAAAAUPHVkDgd9ljIHqbq9IrxaJDRIX2HRPLSxoar2UcaFGMnvbcFicJZQWMrS+zdusKsjffDCBaIWKIrAbiWvDrAv7/ViiUmaT9N7mwiVqoJKGpOoktpUGkIsZhrkk7KOdKgZf6gb2suPfXU2IZJwYm1LNU+AFjd4Lck9HZwYnv4NOtotFt9P0LGvqKOd+IPjLem1DqjuqMR1LC23L5fj0AJ3w0vSzdCYq2/wwqFNr/Ne9Nf/ttQ9WpcMx8srmSnPTxg7s4ydy8jIA==",
                                    },
                                    images: {
                                        fallback: {
                                            src: "/static/fd4459e3d88bc7c672b1e0c2ee25b12a/e3d21/d4.avif",
                                            srcSet: "/static/fd4459e3d88bc7c672b1e0c2ee25b12a/7f730/d4.avif 161w,\n/static/fd4459e3d88bc7c672b1e0c2ee25b12a/37728/d4.avif 321w,\n/static/fd4459e3d88bc7c672b1e0c2ee25b12a/e3d21/d4.avif 642w",
                                            sizes: "(min-width: 642px) 642px, 100vw",
                                        },
                                        sources: [
                                            {
                                                srcSet: "/static/fd4459e3d88bc7c672b1e0c2ee25b12a/89a72/d4.webp 161w,\n/static/fd4459e3d88bc7c672b1e0c2ee25b12a/5f9c8/d4.webp 321w,\n/static/fd4459e3d88bc7c672b1e0c2ee25b12a/74cc2/d4.webp 642w",
                                                type: "image/webp",
                                                sizes: "(min-width: 642px) 642px, 100vw",
                                            },
                                        ],
                                    },
                                    width: 642,
                                    height: 300,
                                },
                            },
                        },
                    },
                },
            },
            {
                node: {
                    frontmatter: {
                        slug: "diablo-ii-resurected",
                        name: "Diablo II: Resurrected",
                        shortName: "D2",
                        official: true,
                        seasonKeyword: "season",
                        url: "https://diablo2.blizzard.com/",
                        group: "Diablo Official",
                        logo: {
                            childImageSharp: {
                                gatsbyImageData: {
                                    layout: "constrained",
                                    placeholder: {
                                        fallback:
                                            "data:image/heif;base64,AAAAHGZ0eXBhdmlmAAAAAGF2aWZtaWYxbWlhZgAAAZhtZXRhAAAAAAAAACFoZGxyAAAAAAAAAABwaWN0AAAAAAAAAAAAAAAAAAAAAA5waXRtAAAAAAABAAAANGlsb2MAAAAAREAAAgACAAAAAAG8AAEAAAAAAAAAdAABAAAAAAIwAAEAAAAAAAAA4QAAADhpaW5mAAAAAAACAAAAFWluZmUCAAAAAAEAAGF2MDEAAAAAFWluZmUCAAAAAAIAAGF2MDEAAAAA12lwcnAAAACxaXBjbwAAABNjb2xybmNseAACAAIABoAAAAAMYXYxQ4EAHAAAAAAUaXNwZQAAAAAAAAAUAAAADgAAAA5waXhpAAAAAAEIAAAAOGF1eEMAAAAAdXJuOm1wZWc6bXBlZ0I6Y2ljcDpzeXN0ZW1zOmF1eGlsaWFyeTphbHBoYQAAAAAMYXYxQ4EgAgAAAAAUaXNwZQAAAAAAAAAUAAAADgAAABBwaXhpAAAAAAMICAgAAAAeaXBtYQAAAAAAAAACAAEEgYYHiAACBIIDhIUAAAAaaXJlZgAAAAAAAAAOYXV4bAACAAEAAQAAAV1tZGF0EgAKBRgQ56wqMmkYABhhQO2ys5HYdsijxLxH+DinF2TDb70vbO/4tYeU0lTljCN238FSP6/FnnRhMV5bwsNgvvTRqANB0bvylxV2SbJZ/otceL0Q6A7Jsc10geyHx/+1omOl037si7SbscMSaFtfLfjb9mASAAoFOBDnrBIy1QEYAAMMYEUA8IpS//T3D/QuACxf1qa3jOAy84xbjJhG1CUUssSoRChefIYH62wvT211pA6WQyRSOyyDY+UGvMQWe3UoHzI8Ukr3bRv+BKhBtIoIHDUoWPkkrHbNZEPAkmwn48po1wZ4wgcQScoy1Uh2j5F+4zRxlgmjGT9NIkg5A6ltA69HuZi4JS5gi755JY9am61fj5Yilpn3rB2HXCs5WmEAfAjhfZX+/v1Wmjx+xZ+sL/fCBwLpB6OMqX7rbEyqf7DhVY8rfT8Kf5+cW9kqF+WfmoA=",
                                    },
                                    images: {
                                        fallback: {
                                            src: "/static/b40fb391342ecc201e3a6ca275f289ed/01451/diablo2-logo-lg.avif",
                                            srcSet: "/static/b40fb391342ecc201e3a6ca275f289ed/14aa2/diablo2-logo-lg.avif 338w,\n/static/b40fb391342ecc201e3a6ca275f289ed/0582b/diablo2-logo-lg.avif 675w,\n/static/b40fb391342ecc201e3a6ca275f289ed/01451/diablo2-logo-lg.avif 1350w",
                                            sizes: "(min-width: 1350px) 1350px, 100vw",
                                        },
                                        sources: [
                                            {
                                                srcSet: "/static/b40fb391342ecc201e3a6ca275f289ed/9d421/diablo2-logo-lg.webp 338w,\n/static/b40fb391342ecc201e3a6ca275f289ed/1ed89/diablo2-logo-lg.webp 675w,\n/static/b40fb391342ecc201e3a6ca275f289ed/0862f/diablo2-logo-lg.webp 1350w",
                                                type: "image/webp",
                                                sizes: "(min-width: 1350px) 1350px, 100vw",
                                            },
                                        ],
                                    },
                                    width: 1350,
                                    height: 945,
                                },
                            },
                        },
                    },
                },
            },
            {
                node: {
                    frontmatter: {
                        slug: "dwarven-realms",
                        name: "Dwarven Realms",
                        shortName: "dr",
                        official: true,
                        seasonKeyword: "season",
                        url: "https://www.dwarvenrealms.com/",
                        group: null,
                        logo: {
                            childImageSharp: {
                                gatsbyImageData: {
                                    layout: "constrained",
                                    placeholder: {
                                        fallback:
                                            "data:image/webp;base64,UklGRkwBAABXRUJQVlA4WAoAAAAQAAAAEwAACgAAQUxQSJ8AAAABgCPbtmlrn2dGtnNltm3bfu/btu2f/fA3002IiAmAf0ZfEAACBIC+EK82ThypcKqK3+jMqFzztk0dF7Z5iretd9eL6HI21+LtqZdv6OjDQP00OiL6eDMqdEl7TluWAQ+eTnp9sOaviHOULiumLQVyBJNJCWPlXaLF28+MiO72tnkLvl6Ob63ZsLHd8mZ1xkTsmxNjL4bgr0Q8CrL+9GcAVlA4IIYAAADwAwCdASoUAAsAPlEejEQjoaEYBAA4BQS0gAHw5Pv9knMc1vEVsk0QAP7+aSLMDbettF/yhQUy8AJXpiutWCuP0P2+xbIHCpZfGQOhuZL7qCHweNfaBjf7CkeHl+Mes0+73XMlyLD8QzNSsr0gcP6R/dI4lWsCgbK0XNF40cyRv/oUIAAAAA==",
                                    },
                                    images: {
                                        fallback: {
                                            src: "/static/e759c80e0454da22f4344724c04169d1/2876e/dwarven-realms-logo.webp",
                                            srcSet: "/static/e759c80e0454da22f4344724c04169d1/10836/dwarven-realms-logo.webp 30w,\n/static/e759c80e0454da22f4344724c04169d1/e2def/dwarven-realms-logo.webp 59w,\n/static/e759c80e0454da22f4344724c04169d1/2876e/dwarven-realms-logo.webp 118w",
                                            sizes: "(min-width: 118px) 118px, 100vw",
                                        },
                                        sources: [],
                                    },
                                    width: 118,
                                    height: 62,
                                },
                            },
                        },
                    },
                },
            },
            {
                node: {
                    frontmatter: {
                        slug: "grim-dawn",
                        name: "Grim Dawn",
                        shortName: null,
                        official: true,
                        seasonKeyword: "expansion",
                        url: "https://www.grimdawn.com/",
                        group: null,
                        logo: {
                            childImageSharp: {
                                gatsbyImageData: {
                                    layout: "constrained",
                                    placeholder: {
                                        fallback:
                                            "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAMCAYAAABiDJ37AAAACXBIWXMAAAsTAAALEwEAmpwYAAABZElEQVR42mNgGDLg////jKGhocz19fVMMAwUZoRiBmQ+lA3WA8IwNURZAtUAA0A+igUMyJYyIAkwNDdXyxeWFVpkF2br5lQXK5bWlKoCNUkVVlVJ+/j4cPW0txtPmDBBPL++XiCrsFAlLS2NNTc3VzmvvFwuPitLAsSHm2hlZcUb6O+5wMfLvTQ+LupUWnryluDQ4E3FxTm38rOTjsTHhyukp8VtSU1NWJiVFr0+NMD9eHpq/I7o2Oj1UVGhFyIigpcCjWGBGygjI8PpZ2u+LNTDaVF+hN/Wgkj/7ZE+rvsKk8KvZEX4HajwdlbK8HNelhkVdDbZx+F4qpvl8Ywgj/sxPi6TYoO8l5WlR07C8LK9qamEjYmJkhoPj4i5ppKqsZq8hoqKhKi5jo64PAMDh6uVqYGTjZmWkqAgv7GKrLKxmqSIioSEqJqamoiWlhYP0RFDBGAkRoIRS+wxoYkzEjJwcAIAlO900/Ifw/wAAAAASUVORK5CYII=",
                                    },
                                    images: {
                                        fallback: {
                                            src: "/static/d558ff111346928643c69606cab25740/f83c4/grim-dawn-logo.png",
                                            srcSet: "/static/d558ff111346928643c69606cab25740/d92ad/grim-dawn-logo.png 120w,\n/static/d558ff111346928643c69606cab25740/e7d22/grim-dawn-logo.png 240w,\n/static/d558ff111346928643c69606cab25740/f83c4/grim-dawn-logo.png 480w",
                                            sizes: "(min-width: 480px) 480px, 100vw",
                                        },
                                        sources: [
                                            {
                                                srcSet: "/static/d558ff111346928643c69606cab25740/0e0dc/grim-dawn-logo.webp 120w,\n/static/d558ff111346928643c69606cab25740/0f916/grim-dawn-logo.webp 240w,\n/static/d558ff111346928643c69606cab25740/dee3a/grim-dawn-logo.webp 480w",
                                                type: "image/webp",
                                                sizes: "(min-width: 480px) 480px, 100vw",
                                            },
                                        ],
                                    },
                                    width: 480,
                                    height: 285,
                                },
                            },
                        },
                    },
                },
            },
            {
                node: {
                    frontmatter: {
                        slug: "hero-siege",
                        name: "Hero Siege",
                        shortName: "HS",
                        official: true,
                        seasonKeyword: "season",
                        url: "https://panicartstudios.com/hsportal/",
                        group: null,
                        logo: {
                            childImageSharp: {
                                gatsbyImageData: {
                                    layout: "constrained",
                                    placeholder: {
                                        fallback:
                                            "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAMCAYAAABiDJ37AAAACXBIWXMAAAPoAAAD6AG1e1JrAAACrklEQVR42pWTSUxTQRzG//S9N+893kafUiy0iFQqbUFKqmCC1eByUEOMy8WgTUFkkT3GBhHbKFVcUETcStyiYgx64KDGgPGmiVcPHrx4UKPRxHDxQsTPhwfjmuCXfJnJZOb3/2e+GaJZKsWl17WT2EL/qzbGiqwh7ee14XRhaSJNfrObY5v/GzgsseoosZtVROkDghCccZLkgXoSX3YIwo5+C35HFvsHbHLs98K/qI/I3q/R3Jn5chJC20jcu5PY/S5Rfh2RpevLiBvqFdjzyxJ70EjiZLONHXcRyf8EdklSXlLk78U48UGcpP1bOOHCkYXa+yaPgbGwic55ynS9kvHxUmnmeLdDnY6ksRcbiD+cYlIiyfMrfoBKKN+71Qz0Rlye67WevCf7yt1vd3md6CxwIV7ixvA6J44E5+PEEjd6yjPRGXSgw5+NY+E8NDhzpxLF+R/qsgpGapy+3kT+ei+5ifXEyjQcCGk4Hc5AtUfGqWUG+ioMjKybgyvrHbixcR6i2RL2F6vo9Cs4s9TA3lIV8TIdVQ6G1BoTh8IGNuneZlqt8w97PApiDhldOTIasiRc9GoYLNBxOk/FRbeKayETE6ucuBq0Y6IyE1cX6eh2yrgdMNBgF3HXryOer2Ctbt6iRrvyKpWjfD6XrbwdtAAHPSquFGagz62jPVtFt3WHkRwNUZeORMCO2EIdlxabGFqgY4/VxJkFKsYKjU/jPgOtWRmTNOrSzVEiLkQkVBB3rVLkpst5DmHOhogioEYX0VZqfndUE7Bd5dFsMKwUrT0CN2Wlf+58rmF/5FCyHvvNwB9pryY+Xmuwr0lfOlJFGg4ValZAMx3KSPo0XA7q6CtUUKuyL6vINruf00py2WGSz7YQe1ZH4ofGNAFNlq13+a6V2NOjJJ+MkOj92+FvLbHonUgF4YMAAAAASUVORK5CYII=",
                                    },
                                    images: {
                                        fallback: {
                                            src: "/static/4dc72086ef71713aed7d143e08888f95/43c23/site-logo.webp",
                                            srcSet: "/static/4dc72086ef71713aed7d143e08888f95/af196/site-logo.webp 63w,\n/static/4dc72086ef71713aed7d143e08888f95/d205a/site-logo.webp 125w,\n/static/4dc72086ef71713aed7d143e08888f95/43c23/site-logo.webp 250w",
                                            sizes: "(min-width: 250px) 250px, 100vw",
                                        },
                                        sources: [],
                                    },
                                    width: 250,
                                    height: 155,
                                },
                            },
                        },
                    },
                },
            },
            {
                node: {
                    frontmatter: {
                        slug: "last-epoch",
                        name: "Last Epoch",
                        shortName: "LE",
                        official: true,
                        seasonKeyword: "season",
                        url: "https://lastepoch.com",
                        group: null,
                        logo: {
                            childImageSharp: {
                                gatsbyImageData: {
                                    layout: "constrained",
                                    placeholder: {
                                        fallback:
                                            "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAKCAYAAAC0VX7mAAAACXBIWXMAAAsTAAALEwEAmpwYAAACpklEQVR42mNgQANT6rN4JlTH2oRqhbKB+Ev7KpSKi2O46+PjOaZWJjn6WVlJFcd7eTdn+ceGhlpwQrUxopryn4ExN9eDHcRc2Bau1lsROpOBoZ5pVdZ+nik1MdvKY4Iy04zTNMrjvE6HWzpaRXtYVlSnuM0GKmf+//8/48w0Y9b//5EMra+vZ4IJdOT5yFUnuKzzN3VxL44Ija9ICO4qCA7uspePdqiICpo7pyEn1cvS0q6j0D8dpD4tLY0VZgbcwK4SL4n0IOuczFDHtHR/d4fyxODCosjAWhMxFz9b2eD4mrCk7S0R2eszLDP6LMVDnYoifTOjnC3TCmI8oidWJoqmhVqFL5uQLA43cG13dEhjuvM1bwuDyu6MmIj2nMB96V6+cyfkpW/PcQ080OSW+n5P6frPSzMW7GmISlheGxUxU1fAIL41x29/U3pAWGuez8HtM9O84QYubYvMKomxP+dibBw1ISvPpjkt4JCrvHNjsWPq/FlRtVe3pKx5NzdsypP+iOKTvelpZ2NNo3MZGHI06pJ8duWFONQDw/P06glxMXADd8xMtarPcN2VHeKYm+pvXVIe6zlDniFSQ5zB0anFp251c0DOjTBTs3ORRp59xoL2mam+Nivq0kOr86MdlpakeSjXZLhN3zkrxQBu4Mz6NK7JpX5S0Y666rYaxpIqDNF8tgwJspac0aaSDK7WFpK2Ka5yXsl6DLE2OgxpGlZ8ccpOMqHSOmI64n7qVrzJbhZCU7JCeRiwgXpgcrGXr+ewYcgUtGHIFbUWzJMzZi9R1mLIk7NhT1Qy584TtxIu5VVhmMgeyrCKGash/4EJs76egameAYTrmYwZ0li1GOrZ7BnqOcwYcvls+DMFjQXT+K0YSnmBclwgOZBhILWQJMPABEvcAMn92/5yjyv2AAAAAElFTkSuQmCC",
                                    },
                                    images: {
                                        fallback: {
                                            src: "/static/0fea596195616d00656705921772610d/dc2db/lastepoch.png",
                                            srcSet: "/static/0fea596195616d00656705921772610d/501b2/lastepoch.png 200w,\n/static/0fea596195616d00656705921772610d/8bed5/lastepoch.png 400w,\n/static/0fea596195616d00656705921772610d/dc2db/lastepoch.png 800w",
                                            sizes: "(min-width: 800px) 800px, 100vw",
                                        },
                                        sources: [
                                            {
                                                srcSet: "/static/0fea596195616d00656705921772610d/51e7d/lastepoch.webp 200w,\n/static/0fea596195616d00656705921772610d/a6880/lastepoch.webp 400w,\n/static/0fea596195616d00656705921772610d/670b1/lastepoch.webp 800w",
                                                type: "image/webp",
                                                sizes: "(min-width: 800px) 800px, 100vw",
                                            },
                                        ],
                                    },
                                    width: 800,
                                    height: 394,
                                },
                            },
                        },
                    },
                },
            },
            {
                node: {
                    frontmatter: {
                        slug: "median-xl",
                        name: "Median XL",
                        shortName: "MXL",
                        official: false,
                        seasonKeyword: "season",
                        url: "https://www.median-xl.com/",
                        group: "Diablo Mods",
                        logo: {
                            childImageSharp: {
                                gatsbyImageData: {
                                    layout: "constrained",
                                    placeholder: {
                                        fallback:
                                            "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAALCAYAAAB/Ca1DAAAACXBIWXMAAA7CAAAOwgEVKEqAAAACEklEQVR42mNgwAH+MzAw4pDCJY6k+T8DIwijGcQYysDAXM/AwGTPwMACEgDxgRQTuoVg/VgsYqqHKq63Z2BZasMgiM1F21QY2M+kMbAi64M5BuHCTEHZ/0kC8mB2Lo/omVBB/m5jjjVZJryxFSb8SsmG3DkguUpjnpBKC95lkwOkhMFq6+3BLv9fLKH1P1tEDW7giXz5gAp38YVyuvyCVU6im3+2qxge9Bd6GmXAf3ydj+Cc1f4ij0HqZgWJby+z4Nv3v13G7n+VtEVHqIxuiYtoxeY8ldqZcbL5cAO3xktapzuLv892lTgaYCFydF2slOWGHNW/pZ6SrwpdxF5tKlC9tSJN3rHUS/LUzCDJVctSFD+vjZFZcSRT3jHHQ+L1hDDp92k+sm5wAxcGiNqU+0gcSvOQ3F3gKbGq2EZIqy9Sdk+AAf+jYDPhHxOTlfdsqlcTcTcSXl3iKDx7dpLCmS4/ifXroiUjW8JkpoXYip6IshG0hhs4LUNBvSRUPnDLNBvBohC5UJBYsKlwuaEs15EQA/4OA3muvSAxbTnumfoS7B9C9Hl/uGjxr+jK1VYui1R2T3GX1S70lpHGlu6YYLFqLM1p7qzGaZpmLCJpKs8Z+H+mMauFMpeRjDBbgAAPs7+CKKs+LJYx0iYo2uvrIdEfGgpOa8QkcHCSAukDYWISPBPIcKhiFqgYM5TNAkvg6AAAEfycXEdOrtsAAAAASUVORK5CYII=",
                                    },
                                    images: {
                                        fallback: {
                                            src: "/static/891c733261f89009f4a75513d654e154/514bd/medianxl-logo.png",
                                            srcSet: "/static/891c733261f89009f4a75513d654e154/cdf75/medianxl-logo.png 112w,\n/static/891c733261f89009f4a75513d654e154/c99af/medianxl-logo.png 224w,\n/static/891c733261f89009f4a75513d654e154/514bd/medianxl-logo.png 448w",
                                            sizes: "(min-width: 448px) 448px, 100vw",
                                        },
                                        sources: [
                                            {
                                                srcSet: "/static/891c733261f89009f4a75513d654e154/145fa/medianxl-logo.webp 112w,\n/static/891c733261f89009f4a75513d654e154/8b52d/medianxl-logo.webp 224w,\n/static/891c733261f89009f4a75513d654e154/333b1/medianxl-logo.webp 448w",
                                                type: "image/webp",
                                                sizes: "(min-width: 448px) 448px, 100vw",
                                            },
                                        ],
                                    },
                                    width: 448,
                                    height: 252,
                                },
                            },
                        },
                    },
                },
            },
            {
                node: {
                    frontmatter: {
                        slug: "nrftw",
                        name: "No Rest For The Wicked",
                        shortName: "nrftw",
                        official: true,
                        seasonKeyword: "content update",
                        url: "https://norestforthewicked.com",
                        group: null,
                        logo: {
                            childImageSharp: {
                                gatsbyImageData: {
                                    layout: "constrained",
                                    placeholder: {
                                        fallback:
                                            "data:image/webp;base64,UklGRogBAABXRUJQVlA4WAoAAAAQAAAAEwAADAAAQUxQSKMAAAABgGTbtmlnf9u2bduObacDvxzbNqpJD9TBryZExASg7QYBPRxCLxe7Y9htH26juN3UzOROdnE1+8skoj2DN/aabrqPP5QkEIitAKHIkcgUbt9senTI1io90ep+rdLQUZgsuspMAqjf0+fSwte6TN0M6p6Sh/IHAFMzn2ni/xGTcnjDuQvu8D8BkH62+nCvKMenfY352EI+CwB8Pg1XBPTQj04BAFZQOCC+AAAAcAUAnQEqFAANAD5RHoxEI6GhGAQAOAUEsoBOmUGQVkAuysebbm8OEdYvcDfN3JZ8Nl4xAAD++u9FsXmkZddDkyQqaLvcw4QzOWti5OmVbDYETwnN0Pj4k+kLOl+7Qcyt2qgr1VwvG6xjm5y4f6MSRz3eIPGq/xhyXHsieItuFPQRjBFQ5BoK37hnO+QnHgT8oLpdWodcCz3ZWOOGyhUTu2Qv+1tcfw/GeAV4GxAqSzcAdPMVIqkIodxW0AAAAA==",
                                    },
                                    images: {
                                        fallback: {
                                            src: "/static/79880333382eb9f44af4dab51ea83532/99967/nrftwlogo.webp",
                                            srcSet: "/static/79880333382eb9f44af4dab51ea83532/957cd/nrftwlogo.webp 155w,\n/static/79880333382eb9f44af4dab51ea83532/fa77c/nrftwlogo.webp 310w,\n/static/79880333382eb9f44af4dab51ea83532/99967/nrftwlogo.webp 620w",
                                            sizes: "(min-width: 620px) 620px, 100vw",
                                        },
                                        sources: [],
                                    },
                                    width: 620,
                                    height: 411,
                                },
                            },
                        },
                    },
                },
            },
            {
                node: {
                    frontmatter: {
                        slug: "path-of-diablo",
                        name: "Path of Diablo",
                        shortName: "PoD",
                        official: false,
                        seasonKeyword: "season",
                        url: "https://pathofdiablo.com/",
                        group: "Diablo Mods",
                        logo: {
                            childImageSharp: {
                                gatsbyImageData: {
                                    layout: "constrained",
                                    placeholder: {
                                        fallback:
                                            "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAECAYAAACOXx+WAAAACXBIWXMAAA7DAAAOwwHHb6hkAAAAhUlEQVR42o3NvQrCMBDA8dSkYJGuIhRq20WooKVDP8ZKdbAufQLf/yUS/4EIt2ngx10udxelOM65LYz6cehJsFN/NK6YkeOKDikOuIVajB5PFKjQIsPFz8iFJ1+01g7EI+7Yo8Q7fKBxxogaEx5o8MIiF0bYhCGfR/JN5Eb0mBD9XX+XfQDEFqVeqmm53AAAAABJRU5ErkJggg==",
                                    },
                                    images: {
                                        fallback: {
                                            src: "/static/4704ee963ea805d250653a427ac951bf/3e0c0/pathofdiablo-logo.png",
                                            srcSet: "/static/4704ee963ea805d250653a427ac951bf/c0313/pathofdiablo-logo.png 124w,\n/static/4704ee963ea805d250653a427ac951bf/9fd52/pathofdiablo-logo.png 248w,\n/static/4704ee963ea805d250653a427ac951bf/3e0c0/pathofdiablo-logo.png 495w",
                                            sizes: "(min-width: 495px) 495px, 100vw",
                                        },
                                        sources: [
                                            {
                                                srcSet: "/static/4704ee963ea805d250653a427ac951bf/041bd/pathofdiablo-logo.webp 124w,\n/static/4704ee963ea805d250653a427ac951bf/984fa/pathofdiablo-logo.webp 248w,\n/static/4704ee963ea805d250653a427ac951bf/e8c21/pathofdiablo-logo.webp 495w",
                                                type: "image/webp",
                                                sizes: "(min-width: 495px) 495px, 100vw",
                                            },
                                        ],
                                    },
                                    width: 495,
                                    height: 105,
                                },
                            },
                        },
                    },
                },
            },
            {
                node: {
                    frontmatter: {
                        slug: "pd2",
                        name: "Project Diablo 2",
                        shortName: "PD2",
                        official: false,
                        seasonKeyword: "season",
                        url: "https://www.projectdiablo2.com",
                        group: "Diablo Mods",
                        logo: {
                            childImageSharp: {
                                gatsbyImageData: {
                                    layout: "constrained",
                                    placeholder: {
                                        fallback:
                                            "data:image/webp;base64,UklGRrAAAABXRUJQVlA4WAoAAAAQAAAAEwAAAQAAQUxQSCkAAAAApJBUvmSAblWQDndvRW2eXE6yApE4SElxTlBASTYAVjtVVl1PSGcAawBWUDggYAAAANADAJ0BKhQAAgA+UR6MRCOhoRgEADgFBLGAWouAAOlOz3Qd/o/lAAD+9LLk541Hx3I79LYIhyVlSQ3N3QcUfuhfVKnsOAb8/G4pK9pf/1b3a8QmvH/msU+35LMgVmboAA==",
                                    },
                                    images: {
                                        fallback: {
                                            src: "/static/a3fd661cbeb01ef70688c627f99b0003/39aeb/projectdiablo2logo.webp",
                                            srcSet: "/static/a3fd661cbeb01ef70688c627f99b0003/3dafa/projectdiablo2logo.webp 75w,\n/static/a3fd661cbeb01ef70688c627f99b0003/fbc6f/projectdiablo2logo.webp 150w,\n/static/a3fd661cbeb01ef70688c627f99b0003/39aeb/projectdiablo2logo.webp 300w",
                                            sizes: "(min-width: 300px) 300px, 100vw",
                                        },
                                        sources: [],
                                    },
                                    width: 300,
                                    height: 30,
                                },
                            },
                        },
                    },
                },
            },
            {
                node: {
                    frontmatter: {
                        slug: "path-of-exile2",
                        name: "Path of Exile 2",
                        shortName: "PoE2",
                        official: true,
                        seasonKeyword: "league",
                        url: "https://pathofexile2.com/",
                        group: "Path of Exile",
                        logo: {
                            childImageSharp: {
                                gatsbyImageData: {
                                    layout: "constrained",
                                    placeholder: {
                                        fallback:
                                            "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAPCAYAAADkmO9VAAAACXBIWXMAAAsTAAALEwEAmpwYAAAC1UlEQVR42mNgoDX4z8DAuKg7Q+zD/0dC////F5jTWSplKyUoG2qsJbdq1RQJoBj/l5cnJfrz/QWINZOpNskna05P/Ysdsya9mpoTdy7Y3vRMjr/L4ZVNJXfXTOt931eVc64101cP7ID//xlxmhQaGsoMUiDEwCATYaJzJ97c4L+Vqtw3N2u9/7b6qr+8tFS+pRpp/XeUFF4BVM74/389E8gBGAbV19cznVi8mA/MjvFVCbbQn+pprfs1yMn0f5K/y79AW+N/8R62/0KdTf+5W2j9D3QwuRVkYZjj6qrHDXQA0/5VU3hQvAgiqvOS2lJjgmZ5WxjMt9VW+e+op/w/S1/tf4CZ3v9oV5v/cY5m/0NUZf+HKEv9t9JX+e+up/4hxN6iIzc1emt/fb4dzGFgb4I47lbG/k5Whv9tjTT+ZYZ7/wsx0vifY2f2P9TO9H+mn+v/WEfz/xFigv+zlOX/Z/k5/XPUVf5tbaz1385M93KhhQUn1HGMcMKVQZxbS1b8rIWu8v+0UI/fZnxc/5MtDP6nB7n/9zU3/B/mYv3fV1L0f7Ka0v9wB7N/FlqKv3TU5P6rSQqmQA1jxvC2sgBvnJqkyH8vc53//voq/+IM1f5HaCn+9zXU+u+mo/o/zEjzfwgwGNxNtf+YaCr8lxbgPaUlKsqD7Dq0WNZiU+LjqZDl4zpuLCP2z0tO/J+xpMgfK0Wp//pSov9dFaV+O8iI/lcRE3yrIMC9WoOPzxWnYcgutZHjF7SSEblgICrwX1yA95eYIO8fcUHe37LC/H+cgd62khCqg6pnwWcYGBgbM7CC6HAz9akJlob/dUQEzityc3xR4ea86aCpfCHX3uy/syK/C9hHaOGGM3GD6OwI94z2vLhZQCaHkajAVkthvqy1GYFi6d7WB5wsVKUJeRUZMEISuKVYTbSjOohty8UlacrAIAxil4eZ6deHhrKRW1YwYuHjdRUAuGXwTAd/NgAAAAAASUVORK5CYII=",
                                    },
                                    images: {
                                        fallback: {
                                            src: "/static/20558ecc09a8a8b27a324870e118cdc6/ce125/poe2.png",
                                            srcSet: "/static/20558ecc09a8a8b27a324870e118cdc6/a5724/poe2.png 150w,\n/static/20558ecc09a8a8b27a324870e118cdc6/b2734/poe2.png 300w,\n/static/20558ecc09a8a8b27a324870e118cdc6/ce125/poe2.png 600w",
                                            sizes: "(min-width: 600px) 600px, 100vw",
                                        },
                                        sources: [
                                            {
                                                srcSet: "/static/20558ecc09a8a8b27a324870e118cdc6/4d97b/poe2.webp 150w,\n/static/20558ecc09a8a8b27a324870e118cdc6/5741a/poe2.webp 300w,\n/static/20558ecc09a8a8b27a324870e118cdc6/2e6f9/poe2.webp 600w",
                                                type: "image/webp",
                                                sizes: "(min-width: 600px) 600px, 100vw",
                                            },
                                        ],
                                    },
                                    width: 600,
                                    height: 450,
                                },
                            },
                        },
                    },
                },
            },
            {
                node: {
                    frontmatter: {
                        slug: "path-of-exile",
                        name: "Path of Exile",
                        shortName: "PoE",
                        official: true,
                        seasonKeyword: "league",
                        url: "https://www.pathofexile.com/",
                        group: "Path of Exile",
                        logo: {
                            childImageSharp: {
                                gatsbyImageData: {
                                    layout: "constrained",
                                    placeholder: {
                                        fallback:
                                            "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAOCAYAAAAvxDzwAAAACXBIWXMAAAsTAAALEwEAmpwYAAAC30lEQVR42mNgwAJCQ0OZ6+vrmYBMRhC/oyNXpjrXQxkqzfgfKLcKqAYmTzQ4vKVdsCvX3qMoxPByqo/uy5J4k+CeSEkRYvUzQlxnz+Nno1E4MTegZ2JN8v35k2r/91Ql/6sviP43d1L9/47C0KedSdadhSFmBTYqPKLIelHA/vp6FhBdEWBomRdi9b89wvx/c37o/9XrFv9bvWLOv1VLpv6bOmPiv/Vblv+fXRb8tyLO6X+wi34YSE99aCgbVtf9/8/AMrk5aGVxrP3/zubiX5tb0/8tKgz4P3Vi3f+1q2f/n99Z/H9zfsC/yUlOvwpjnP8XReqt+/8fHJaoroxxFeeeUxNZuqMjLjHUXf/b8nkT/u/avfnfprl9/y9MK/6f6mP6P87V5P/G5vT//88f+F9XU/S/oan6/7T29L+9hUapE+rDsqK85QQR7jM2Zp2UYHpxUYrdf08r1d/dzSX/v3149r+5reZ/pI/d/xJzyf8F1lL/G2O8/oNAY3Pd/7jo4P8NxXF/4lw1/9dnuD8yMzPjA5u1KpQB7OQiL6WK5ljT/85mcr/qos3/3L5y7H9ZUsB/L3mu/zPyw/7Xl6X8zzeQ/H8owux/KVDcTF3ob6Kn1q8oV53//naafeCwrGdgQvY7Y1206baccKP/yX4Gf8pi7P9PzAz8t3Fq4/8Z09r/93Y3/68sTvnfmO77L8vf6H+QvcrfjGDD/yHu+seBejnRwxHMCLZW1i6MtMyy0pSckeKp9n1Spd//8qyQfznACIj0s/4fEeD0LyPO/X+sn9lfay3pFQ660vle9qYGOJMOMlCSZlN1MpZaamck+99CR+qLqYbEF30Nif8WejK7RES4DIFKmIhK3OBsZ88ATpM2GiI+NtoSLzzMFd/Y6sl8MFEXf2esIpYBkkszZmANBYX/f+KyH1iRlxa/gbowi4mXiVSdnabIFCUxVl0TOV4rqBomBnKBDDDQgXmMhxjFAAgcI6rEVmzmAAAAAElFTkSuQmCC",
                                    },
                                    images: {
                                        fallback: {
                                            src: "/static/37d4fb900732bfab0bfbe77f03d60ab6/e537c/poe.png",
                                            srcSet: "/static/37d4fb900732bfab0bfbe77f03d60ab6/d9c52/poe.png 500w,\n/static/37d4fb900732bfab0bfbe77f03d60ab6/459af/poe.png 1000w,\n/static/37d4fb900732bfab0bfbe77f03d60ab6/e537c/poe.png 2000w",
                                            sizes: "(min-width: 2000px) 2000px, 100vw",
                                        },
                                        sources: [
                                            {
                                                srcSet: "/static/37d4fb900732bfab0bfbe77f03d60ab6/64b80/poe.webp 500w,\n/static/37d4fb900732bfab0bfbe77f03d60ab6/d3189/poe.webp 1000w,\n/static/37d4fb900732bfab0bfbe77f03d60ab6/273b9/poe.webp 2000w",
                                                type: "image/webp",
                                                sizes: "(min-width: 2000px) 2000px, 100vw",
                                            },
                                        ],
                                    },
                                    width: 2000,
                                    height: 1400,
                                },
                            },
                        },
                    },
                },
            },
            {
                node: {
                    frontmatter: {
                        slug: "slash-diablo",
                        name: "Slash Diablo",
                        shortName: null,
                        official: false,
                        seasonKeyword: "ladder reset",
                        url: "https://slashdiablo.net",
                        group: "Diablo Mods",
                        logo: {
                            childImageSharp: {
                                gatsbyImageData: {
                                    layout: "constrained",
                                    placeholder: {
                                        fallback:
                                            "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAADCAYAAACTWi8uAAAACXBIWXMAAAsTAAALEwEAmpwYAAAA3klEQVR42hWOTUoDQRCFZ+FSUSYkkSE//iAoCC7EgCvXHkBNEIKn8DhexbuIBIceJ9XTXdXd4+izpuBBUfXq1ZcZNgXDFDXq/XdgZ4PNEEAukKmDG3v4wyaac+fcaIvtARHlgNkLCMdG78qy3LWwA5fcZdaXtM1dgjxJK7fU0o20/pXBC+ncKiGtpJNHNT/YH3vPLS985190tlQ922TX6r3Wfh1/5Y3oI8+UZlhLPYuIZwQ6qbiaiHxPlXD25dxYKUch0GlPbe3nIIRwxH880f1cw4omVhfMXOjzq57wH8VRsOyY0cAUAAAAAElFTkSuQmCC",
                                    },
                                    images: {
                                        fallback: {
                                            src: "/static/0b622753fceaf2b6e91f1e1343d90117/d371e/slashdiablo-logo.png",
                                            srcSet: "/static/0b622753fceaf2b6e91f1e1343d90117/1bc5e/slashdiablo-logo.png 106w,\n/static/0b622753fceaf2b6e91f1e1343d90117/ff73b/slashdiablo-logo.png 212w,\n/static/0b622753fceaf2b6e91f1e1343d90117/d371e/slashdiablo-logo.png 424w",
                                            sizes: "(min-width: 424px) 424px, 100vw",
                                        },
                                        sources: [
                                            {
                                                srcSet: "/static/0b622753fceaf2b6e91f1e1343d90117/1c648/slashdiablo-logo.webp 106w,\n/static/0b622753fceaf2b6e91f1e1343d90117/c62db/slashdiablo-logo.webp 212w,\n/static/0b622753fceaf2b6e91f1e1343d90117/6b0cc/slashdiablo-logo.webp 424w",
                                                type: "image/webp",
                                                sizes: "(min-width: 424px) 424px, 100vw",
                                            },
                                        ],
                                    },
                                    width: 424,
                                    height: 64,
                                },
                            },
                        },
                    },
                },
            },
            {
                node: {
                    frontmatter: {
                        slug: "torchlite-infinite",
                        name: "Torchlight: Infinite",
                        shortName: "TI",
                        official: true,
                        seasonKeyword: "season",
                        url: "https://torchlight.xd.com/",
                        group: null,
                        logo: {
                            childImageSharp: {
                                gatsbyImageData: {
                                    layout: "constrained",
                                    placeholder: {
                                        fallback:
                                            "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAALCAYAAAB/Ca1DAAAACXBIWXMAAAsTAAALEwEAmpwYAAABkUlEQVR42mNgoCX4/5+BkXaGMzAwgjA2S7FZjKIWpuD/Xken/7tcpPC5Fl0cw2KYgn/bzPj+H3Ke8P+IUwKI/32vlfL/Uybq/1+7SH377yP3/3+05P//yeL//wcCaR+R/xdiuP8/8Zf9f9hG8P9hZ6X/u53V/tczMCEMvuSR9P+Kf8KfE4HZz9Z4yf/Zb5P6/4hV+/8rthX/P3lM+P8zKPn/n/D8/1/8a/8/9E/4fd4z4P9Z1+7/hxyK/u93rPy/3ykFYdgWe4n/D0Jq/v/PSvrxOD3k7VZPT7DN+90VPh8O1n55LEvl081Mze+PslReXilU+XAi0/jNiRSZLwciDD/uilT9v9NS7P8ONyG4gf9OBkb/vxWa/P9d7LK/9wO6/+xzyPu/314DbNmqVcwzZ55hra+vZ/r//z9j/f56llCg2Cogrq//z1T//z8TRkQBNbOABP7d8mAHs1cxMP8/Y8z6f1Uo8///QAyj/4MMhfGhbGC4wfhoSaEebhOWGGZkQMQkOhtbUoB4B2471HvkJGAAhU72Y2yKifwAAAAASUVORK5CYII=",
                                    },
                                    images: {
                                        fallback: {
                                            src: "/static/c7f543a722477b37a717cb3c9eea08ab/27816/torchlightinfinitelogo.png",
                                            srcSet: "/static/c7f543a722477b37a717cb3c9eea08ab/9ec47/torchlightinfinitelogo.png 160w,\n/static/c7f543a722477b37a717cb3c9eea08ab/26aac/torchlightinfinitelogo.png 320w,\n/static/c7f543a722477b37a717cb3c9eea08ab/27816/torchlightinfinitelogo.png 640w",
                                            sizes: "(min-width: 640px) 640px, 100vw",
                                        },
                                        sources: [
                                            {
                                                srcSet: "/static/c7f543a722477b37a717cb3c9eea08ab/94784/torchlightinfinitelogo.webp 160w,\n/static/c7f543a722477b37a717cb3c9eea08ab/c064d/torchlightinfinitelogo.webp 320w,\n/static/c7f543a722477b37a717cb3c9eea08ab/2af6d/torchlightinfinitelogo.webp 640w",
                                                type: "image/webp",
                                                sizes: "(min-width: 640px) 640px, 100vw",
                                            },
                                        ],
                                    },
                                    width: 640,
                                    height: 360,
                                },
                            },
                        },
                    },
                },
            },
            {
                node: {
                    frontmatter: {
                        slug: "the-slormancer",
                        name: "The Slormancer",
                        shortName: "slormancer",
                        official: true,
                        seasonKeyword: "patch",
                        url: "https://www.slormitestudios.com/slormancer",
                        group: null,
                        logo: {
                            childImageSharp: {
                                gatsbyImageData: {
                                    layout: "constrained",
                                    placeholder: {
                                        fallback:
                                            "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAHCAYAAAAIy204AAAACXBIWXMAAAsTAAALEwEAmpwYAAAB8klEQVR42mNQV1fnZbBnYGFgYGDS0JAS1jJWkrOH8BlBYkDMYG9vz6JuIGcFZDIbGyvxaxnIRzJAACMDOpBXl9ktpyaTrKwl66esKTNTVFlqgpSabLiWlhYbzEB1dVkpdX35e0p6SmJqOvIBGvryF6HyDMbGklwgi+AGyqrK2kqoSM2WUpX66G4l/zncVem9mrbsEzYJiRBpZWlHPj4+oXqgC6VVZA6LK8uGSajITJRRk5kJ0isF9JGYilSGpJq8BoqL9dTEFYHe3edsJvffy0b+n7au9E85danvUiqSp+TVpNaIyEoUWljKXlPUkvmvoi3zX0NHZp+Gjqyrsa5UvI2p/G4gvxXF+1lOiqtqfJR/d4apvLYxlvk/M0f978427b/FCSr/a7JU/0WHKP5rK1H/lxmr/Hduncaflgy1f45Wcn9CnRX+tIarAfWp//c0k6+EG2iqJb2pwEP5/6p0zT8xznJfq6KU/84o1vhfk6b6Pz1a6X9vpfr/+ny1fz1l6v+7itT/zyrT/F8epfK/Plr1f56P8t+ZcRr/bQ1k57JJiNWBDdRVl4xyNpSaraEqliYvL6QpKi0ayicsnK2oLN4oKCnaJK4gkscvJVyiqik+29hUosbOXLrcUF+iVV1dYkqEg9w0LXXxqVpqkncFpUWbAdgOiYU15/xrAAAAAElFTkSuQmCC",
                                    },
                                    images: {
                                        fallback: {
                                            src: "/static/a4be34d14d8e6afe0027eb266a138176/5acac/slormancer-logo.png",
                                            srcSet: "/static/a4be34d14d8e6afe0027eb266a138176/4edc0/slormancer-logo.png 320w,\n/static/a4be34d14d8e6afe0027eb266a138176/0eead/slormancer-logo.png 640w,\n/static/a4be34d14d8e6afe0027eb266a138176/5acac/slormancer-logo.png 1280w",
                                            sizes: "(min-width: 1280px) 1280px, 100vw",
                                        },
                                        sources: [
                                            {
                                                srcSet: "/static/a4be34d14d8e6afe0027eb266a138176/487a8/slormancer-logo.webp 320w,\n/static/a4be34d14d8e6afe0027eb266a138176/7c2ea/slormancer-logo.webp 640w,\n/static/a4be34d14d8e6afe0027eb266a138176/94493/slormancer-logo.webp 1280w",
                                                type: "image/webp",
                                                sizes: "(min-width: 1280px) 1280px, 100vw",
                                            },
                                        ],
                                    },
                                    width: 1280,
                                    height: 438.99999999999994,
                                },
                            },
                        },
                    },
                },
            },
            {
                node: {
                    frontmatter: {
                        slug: "titan-quest-2",
                        name: "Titan Quest II",
                        shortName: "tq2",
                        official: true,
                        seasonKeyword: "content update",
                        url: "https://titanquest2.thqnordic.com",
                        group: null,
                        logo: {
                            childImageSharp: {
                                gatsbyImageData: {
                                    layout: "constrained",
                                    placeholder: {
                                        fallback:
                                            "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAKCAYAAAC0VX7mAAAACXBIWXMAAAsTAAALEwEAmpwYAAAB3UlEQVR42mNgoDYIDQ1lrq+vZwIyGUE0DIPkXPyCTQJiUupjk7JNwhJSTUMSsoDsfEuQHEQdA9P////h+kBm4bQERJu5BFqYO3j99wiItTdx9LKydvX/H51W7I2sBgPEBLq5pkT4aud6eLDHh3pJ5CaGiubH+wuA5Cxtbe2Mze3+e7p6eiZGBWfbOTj/9wkKCwbJZUZ5C+ZFOIm3ZccKz22tFC3NiFaP9bfzYugqiY2aVBJlPbMq0bOnKMpnWm2Ke2tGYMSc2iTLmiSf+uQQr//VGWF9DqZG0X6udn9qMsMWrenIdp9WERtbl+Qd3ZUfadmZF1HYlBmg2V8SkcrQmODq25Xpq1cW42bVk+Oj0RznalcRYG5cG2plmR1gU+RnZ/I/zNE0N9hGJ89aT+NvhLtlS2eKm099rItNvINRdKiJunqIiVJikY+xRnW4ZSiDsSQDVygDAzg8/gMjhgEYyDC+kpK6iaqK5n8XFw8Lc3VpB3Ul5f+Wli7uKGEIVA/mA/XoiTNww8Py/38GkAQjyFB7ewYWkJixtrajrZHp/7S4TEczDSMLS32j/27OPsGQWLZnAcUyVDsTcrwwYokrsJitrqadt4leS1ZogE2Ug421u45Wi4uppTMhfVQFAB/hl220VBbVAAAAAElFTkSuQmCC",
                                    },
                                    images: {
                                        fallback: {
                                            src: "/static/79e36ab2dee478bd20fd156d46794c90/7b850/logo_titanquest2.png",
                                            srcSet: "/static/79e36ab2dee478bd20fd156d46794c90/69c22/logo_titanquest2.png 192w,\n/static/79e36ab2dee478bd20fd156d46794c90/e761e/logo_titanquest2.png 384w,\n/static/79e36ab2dee478bd20fd156d46794c90/7b850/logo_titanquest2.png 768w",
                                            sizes: "(min-width: 768px) 768px, 100vw",
                                        },
                                        sources: [
                                            {
                                                srcSet: "/static/79e36ab2dee478bd20fd156d46794c90/a378e/logo_titanquest2.webp 192w,\n/static/79e36ab2dee478bd20fd156d46794c90/e8c30/logo_titanquest2.webp 384w,\n/static/79e36ab2dee478bd20fd156d46794c90/e9647/logo_titanquest2.webp 768w",
                                                type: "image/webp",
                                                sizes: "(min-width: 768px) 768px, 100vw",
                                            },
                                        ],
                                    },
                                    width: 768,
                                    height: 375,
                                },
                            },
                        },
                    },
                },
            },
            {
                node: {
                    frontmatter: {
                        slug: "undecember",
                        name: "Undecember",
                        shortName: "UD",
                        official: true,
                        seasonKeyword: "season",
                        url: "https://undecember.line.games/",
                        group: null,
                        logo: {
                            childImageSharp: {
                                gatsbyImageData: {
                                    layout: "constrained",
                                    placeholder: {
                                        fallback:
                                            "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAGCAYAAADDl76dAAAACXBIWXMAAAsTAAALEwEAmpwYAAAA70lEQVR42o2QW0sCURSFx+gHlA9aopCXepEiKhI0AkGEXiwiQXzroWcZ5n5nGJi/PX1LIijCPLA4a6+99jqbYxh7nCzLeuAeHP5rrqqqxlX7JX9rRVF04zh+AyuF/uH74d91tgbLshpJkjwR+ErgABzsnMJ47vv+seM4Lcz1MAxPoyjq2rZ9gn6BdkQ915bwVhAETdM06+rrKzRHv++6bls5RlmWC8iAoOc0TZc0Z2w0EWdAfIrWof7QhgoH7+gjtA18DL/9+pa1Pvwmz/MRd5vmI3iQBu40JGhrDSmQoaEe8zzvjHpBfUn/Gn4Ff/kELn15zX0LDoIAAAAASUVORK5CYII=",
                                    },
                                    images: {
                                        fallback: {
                                            src: "/static/d7f0700d7e971c970ceeaeac307e6896/82d1d/undecember-logo.png",
                                            srcSet: "/static/d7f0700d7e971c970ceeaeac307e6896/a0710/undecember-logo.png 33w,\n/static/d7f0700d7e971c970ceeaeac307e6896/6f34e/undecember-logo.png 66w,\n/static/d7f0700d7e971c970ceeaeac307e6896/82d1d/undecember-logo.png 132w",
                                            sizes: "(min-width: 132px) 132px, 100vw",
                                        },
                                        sources: [
                                            {
                                                srcSet: "/static/d7f0700d7e971c970ceeaeac307e6896/25904/undecember-logo.webp 33w,\n/static/d7f0700d7e971c970ceeaeac307e6896/02859/undecember-logo.webp 66w,\n/static/d7f0700d7e971c970ceeaeac307e6896/837c1/undecember-logo.webp 132w",
                                                type: "image/webp",
                                                sizes: "(min-width: 132px) 132px, 100vw",
                                            },
                                        ],
                                    },
                                    width: 132,
                                    height: 41,
                                },
                            },
                        },
                    },
                },
            },
            {
                node: {
                    frontmatter: {
                        slug: "grim-dawn-community-league",
                        name: "Grim Dawn Community League",
                        shortName: null,
                        official: false,
                        seasonKeyword: "season",
                        url: "https://www.grimdawnleague.com",
                        group: "Grim Dawn Community",
                        logo: {
                            childImageSharp: {
                                gatsbyImageData: {
                                    layout: "constrained",
                                    placeholder: {
                                        fallback:
                                            "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAADCAYAAACTWi8uAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAxElEQVR42j2OMQrCQBBFcwE7UUQ8iyewFmwtREGJWhiM0VIRSzvxDJLeVgiC9rYpgn2SdXZ2wvoRdeCzM7w/89dxUI84rivKfGaeGWO2xDQqjNmIiGutLRNRC30H3MPb/fYB1M+UWhqt90qphvOrJEmagHetdQTzlQ0fi6LIoTMO1sB8BO0wHzCHLBwSvW7wn/I8v2hNUZo+q/+DMFVgXjMrTywPsNAjoYW10gYrQVMoQNhEmOfgQ2gpwi4zjRG4Av/88A3oNLdShi2xAgAAAABJRU5ErkJggg==",
                                    },
                                    images: {
                                        fallback: {
                                            src: "/static/5053a3e11ab77a7a363b67acced29913/665e7/grim-logo.png",
                                            srcSet: "/static/5053a3e11ab77a7a363b67acced29913/ee182/grim-logo.png 50w,\n/static/5053a3e11ab77a7a363b67acced29913/65266/grim-logo.png 100w,\n/static/5053a3e11ab77a7a363b67acced29913/665e7/grim-logo.png 200w",
                                            sizes: "(min-width: 200px) 200px, 100vw",
                                        },
                                        sources: [
                                            {
                                                srcSet: "/static/5053a3e11ab77a7a363b67acced29913/da2cc/grim-logo.webp 50w,\n/static/5053a3e11ab77a7a363b67acced29913/0a31f/grim-logo.webp 100w,\n/static/5053a3e11ab77a7a363b67acced29913/d9f78/grim-logo.webp 200w",
                                                type: "image/webp",
                                                sizes: "(min-width: 200px) 200px, 100vw",
                                            },
                                        ],
                                    },
                                    width: 200,
                                    height: 32,
                                },
                            },
                        },
                    },
                },
            },
            {
                node: {
                    frontmatter: {
                        slug: "vrising",
                        name: "V Rising",
                        shortName: "vrising",
                        official: true,
                        seasonKeyword: "content update",
                        url: "https://playvrising.com",
                        group: null,
                        logo: {
                            childImageSharp: {
                                gatsbyImageData: {
                                    layout: "constrained",
                                    placeholder: {
                                        fallback:
                                            "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAHCAYAAAAIy204AAAACXBIWXMAAC4jAAAuIwF4pT92AAABl0lEQVR42mPYfu5u1eGbH5Se///PfeL206odx64IMQBBfX09EwMy+P+fEZX7n/E/mhgYVE1fu6du5trCbZce2S85fO0qVDHTmf//WWEaIRb8Z9q//z8LkIliEEgtiF71/z/z/vv3ORg8Ewrnu0ZkFdYv2WtXt2DnbpDkmUefdc88fGcLYp978EnrzNOnXGfvf9Lc//Ilz/G7L8TPPvwqdebpN7kTD94rXn7yTfbM3Xf8x++/Vzj37JMog3Nk5iy7oKSiyrnb7Kvnb9sBMuTl//82l59/iwDaz/jq/39boCs4zzz+aH7q/hfDr///yzz790/z9f//GmeffHa+/eW3+60P35XPPftmf+reR3UG27DMiVahGW3ta0/HFU7fvAlk4JFbH5SP332nd+E5MFyBrjjz9D/X+fv/BU6+/CJx8tpH4ZP3v0gcvfNZ7MrL/zznHv9Q3X//P8fJux/VTt7/aMmg6x6qbu4XfyWpbsr92KrJ7iADQ0NDmRmIAFgjBQS0rdzLLLwiZ0G5TMgxiKkJxIdhROzD9AAAJB/sigZwIiYAAAAASUVORK5CYII=",
                                    },
                                    images: {
                                        fallback: {
                                            src: "/static/1228e6bcef718162180b032df4541724/8e16d/v_rising_main_logo_1.png",
                                            srcSet: "/static/1228e6bcef718162180b032df4541724/fd6a8/v_rising_main_logo_1.png 563w,\n/static/1228e6bcef718162180b032df4541724/59986/v_rising_main_logo_1.png 1125w,\n/static/1228e6bcef718162180b032df4541724/8e16d/v_rising_main_logo_1.png 2250w",
                                            sizes: "(min-width: 2250px) 2250px, 100vw",
                                        },
                                        sources: [
                                            {
                                                srcSet: "/static/1228e6bcef718162180b032df4541724/ec28f/v_rising_main_logo_1.webp 563w,\n/static/1228e6bcef718162180b032df4541724/e3e31/v_rising_main_logo_1.webp 1125w,\n/static/1228e6bcef718162180b032df4541724/ed44c/v_rising_main_logo_1.webp 2250w",
                                                type: "image/webp",
                                                sizes: "(min-width: 2250px) 2250px, 100vw",
                                            },
                                        ],
                                    },
                                    width: 2250,
                                    height: 812,
                                },
                            },
                        },
                    },
                },
            },
        ],
    },
    seasons: {
        edges: [
            {
                node: {
                    frontmatter: {
                        name: "Season 10",
                        game: "Diablo II: Resurrected",
                        url: "https://news.blizzard.com/pl-pl/article/24179243",
                        start: {
                            startDate: "2025-03-08T01:00:00.000Z",
                            confirmed: true,
                            overrideText: null,
                            additionalText: "",
                        },
                        end: {
                            endDate: "2025-06-20T23:59:00.000Z",
                            confirmed: false,
                            overrideText: "est. June",
                            additionalText: null,
                        },
                    },
                },
            },
            {
                node: {
                    frontmatter: {
                        name: "Season 8",
                        game: "Diablo II: Resurrected",
                        url: "https://news.blizzard.com/en-us/diablo2/24111638/diablo-ii-resurrected-ladder-season-8-coming-soon",
                        start: {
                            startDate: "2024-08-24T00:00:00.000Z",
                            confirmed: true,
                            overrideText: null,
                            additionalText: "",
                        },
                        end: {
                            endDate: "2024-12-07T00:00:00.000Z",
                            confirmed: true,
                            overrideText: "",
                            additionalText: null,
                        },
                    },
                },
            },
            {
                node: {
                    frontmatter: {
                        name: "Season 11",
                        game: "Diablo II: Resurrected",
                        url: "",
                        start: {
                            startDate: "2025-06-21T01:00:00.000Z",
                            confirmed: false,
                            overrideText: "est. June",
                            additionalText: "",
                        },
                        end: {
                            endDate: "2025-09-25T00:00:00.000Z",
                            confirmed: false,
                            overrideText: "",
                            additionalText: null,
                        },
                    },
                },
            },
            {
                node: {
                    frontmatter: {
                        name: "Season 9",
                        game: "Diablo II: Resurrected",
                        url: "https://news.blizzard.com/en-us/diablo2/24158875/diablo-ii-resurrected-ladder-season-9-coming-soon",
                        start: {
                            startDate: "2024-12-07T01:00:00.000Z",
                            confirmed: true,
                            overrideText: null,
                            additionalText: "",
                        },
                        end: {
                            endDate: "2025-03-08T00:00:00.000Z",
                            confirmed: false,
                            overrideText: "",
                            additionalText: null,
                        },
                    },
                },
            },
            {
                node: {
                    frontmatter: {
                        name: "S34: Light’s Calling",
                        game: "Diablo III",
                        url: "https://news.blizzard.com/en-us/article/24166297/season-34-lights-calling-preview",
                        start: {
                            startDate: "2025-01-31T01:00:00.000Z",
                            confirmed: true,
                            overrideText: null,
                            additionalText: "Launch date depends on server PDT/CET/KST",
                        },
                        end: {
                            endDate: "2025-06-01T23:59:00.000Z",
                            confirmed: true,
                            overrideText: "",
                            additionalText: "",
                        },
                    },
                },
            },
            {
                node: {
                    frontmatter: {
                        name: "S35: Eternal Conflict",
                        game: "Diablo III",
                        url: "https://news.blizzard.com/en-us/article/24191146/season-35-eternal-conflict-preview",
                        start: {
                            startDate: "2025-06-06T01:00:00.000Z",
                            confirmed: true,
                            overrideText: "",
                            additionalText: "Launch date depends on server PDT/CET/KST",
                        },
                        end: {
                            endDate: "2025-09-30T00:00:00.000Z",
                            confirmed: false,
                            overrideText: "",
                            additionalText: "",
                        },
                    },
                },
            },
            {
                node: {
                    frontmatter: {
                        name: "S33: Shades of the Nephalem",
                        game: "Diablo III",
                        url: "https://news.blizzard.com/en-us/diablo3/24137819/season-33-shades-of-the-nephalem-preview",
                        start: {
                            startDate: "2024-10-25T00:00:00.000Z",
                            confirmed: true,
                            overrideText: null,
                            additionalText: "Launch date depends on server PDT/CET/KST",
                        },
                        end: {
                            endDate: "2025-01-19T00:00:00.000Z",
                            confirmed: true,
                            overrideText: "",
                            additionalText: "",
                        },
                    },
                },
            },
            {
                node: {
                    frontmatter: {
                        name: "Season of Witchcraft",
                        game: "Diablo IV",
                        url: "https://news.blizzard.com/en-us/article/24167111/master-the-occult-in-season-of-witchcraft",
                        start: {
                            startDate: "2025-01-21T18:00:00.000Z",
                            confirmed: true,
                            overrideText: "",
                            additionalText: "",
                        },
                        end: {
                            endDate: "2025-04-29T00:00:00.000Z",
                            confirmed: true,
                            overrideText: "",
                            additionalText: "",
                        },
                    },
                },
            },
            {
                node: {
                    frontmatter: {
                        name: "S32: Ethereal Memory",
                        game: "Diablo III",
                        url: "https://news.blizzard.com/en-us/diablo3/24104599/season-32-ethereal-memory-preview",
                        start: {
                            startDate: "2024-07-12T00:00:00.000Z",
                            confirmed: true,
                            overrideText: "",
                            additionalText: "",
                        },
                        end: {
                            endDate: "2024-10-20T00:00:00.000Z",
                            confirmed: true,
                            overrideText: "",
                            additionalText: "",
                        },
                    },
                },
            },
            {
                node: {
                    frontmatter: {
                        name: "Season 8: Belial’s Return",
                        game: "Diablo IV",
                        url: "https://news.blizzard.com/en-us/article/24189530/combat-deception-in-season-8-belials-return",
                        start: {
                            startDate: "2025-04-29T17:00:00.000Z",
                            confirmed: true,
                            overrideText: "",
                            additionalText: "",
                        },
                        end: {
                            endDate: "2025-08-01T00:00:00.000Z",
                            confirmed: false,
                            overrideText: "est. July/August",
                            additionalText: "",
                        },
                    },
                },
            },
            {
                node: {
                    frontmatter: {
                        name: "Season of Hatred Rising",
                        game: "Diablo IV",
                        url: "https://diablo4.blizzard.com/en-us/season",
                        start: {
                            startDate: "2024-10-08T17:00:00.000Z",
                            confirmed: true,
                            overrideText: null,
                            additionalText: "",
                        },
                        end: {
                            endDate: "2025-01-21T17:59:00.000Z",
                            confirmed: true,
                            overrideText: "",
                            additionalText: null,
                        },
                    },
                },
            },
            {
                node: {
                    frontmatter: {
                        name: "Season V - Infernal Hordes",
                        game: "Diablo IV",
                        url: "https://news.blizzard.com/en-us/diablo4/24119591/",
                        start: {
                            startDate: "2024-08-06T17:00:00.000Z",
                            confirmed: true,
                            overrideText: null,
                            additionalText: "",
                        },
                        end: {
                            endDate: "2024-10-08T17:00:00.000Z",
                            confirmed: true,
                            overrideText: null,
                            additionalText: null,
                        },
                    },
                },
            },
            {
                node: {
                    frontmatter: {
                        name: "Diablo IV: Vessel of Hatred (Season VI)",
                        game: "Diablo IV: Vessel of Hatred",
                        url: "https://diablo4.blizzard.com/en-us/vessel-of-hatred",
                        start: {
                            startDate: "2024-10-08T17:00:00.000Z",
                            confirmed: true,
                            overrideText: null,
                            additionalText: "",
                        },
                        end: {
                            endDate: "",
                            confirmed: false,
                            overrideText: null,
                            additionalText: null,
                        },
                    },
                },
            },
            {
                node: {
                    frontmatter: {
                        name: "Season 1",
                        game: "Dwarven Realms",
                        url: null,
                        start: {
                            startDate: "2024-09-27T17:00:00.000Z",
                            confirmed: true,
                            overrideText: "",
                            additionalText: "",
                        },
                        end: {
                            endDate: "2024-11-21T17:00:00.000Z",
                            confirmed: true,
                            overrideText: "",
                            additionalText: "",
                        },
                    },
                },
            },
            {
                node: {
                    frontmatter: {
                        name: "Season 2",
                        game: "Dwarven Realms",
                        url: null,
                        start: {
                            startDate: "2024-11-29T18:00:00.000Z",
                            confirmed: true,
                            overrideText: "",
                            additionalText: "",
                        },
                        end: {
                            endDate: "2025-01-23T23:59:00.000Z",
                            confirmed: true,
                            overrideText: "",
                            additionalText: "",
                        },
                    },
                },
            },
            {
                node: {
                    frontmatter: {
                        name: "Season 3",
                        game: "Dwarven Realms",
                        url: null,
                        start: {
                            startDate: "2025-01-31T18:00:00.000Z",
                            confirmed: true,
                            overrideText: "",
                            additionalText: "",
                        },
                        end: {
                            endDate: "2025-03-13T23:59:00.000Z",
                            confirmed: true,
                            overrideText: "",
                            additionalText: "",
                        },
                    },
                },
            },
            {
                node: {
                    frontmatter: {
                        name: "Season 4 - Rise of the Necromancer",
                        game: "Dwarven Realms",
                        url: "https://store.steampowered.com/news/app/2015240/view/505075712851445234",
                        start: {
                            startDate: "2025-05-25T17:00:00.000Z",
                            confirmed: true,
                            overrideText: "",
                            additionalText: "",
                        },
                        end: {
                            endDate: "2025-07-30T00:00:00.000Z",
                            confirmed: false,
                            overrideText: "",
                            additionalText: "",
                        },
                    },
                },
            },
            {
                node: {
                    frontmatter: {
                        name: "Season 3.5 - Awakening",
                        game: "Dwarven Realms",
                        url: null,
                        start: {
                            startDate: "2025-03-21T18:00:00.000Z",
                            confirmed: true,
                            overrideText: "",
                            additionalText: "",
                        },
                        end: {
                            endDate: "2025-05-15T00:00:00.000Z",
                            confirmed: true,
                            overrideText: "",
                            additionalText: "",
                        },
                    },
                },
            },
            {
                node: {
                    frontmatter: {
                        name: "Season 7",
                        game: "Grim Dawn Community League",
                        url: null,
                        start: {
                            startDate: "2024-10-19T15:00:00.000Z",
                            confirmed: true,
                            overrideText: null,
                            additionalText: "",
                        },
                        end: {
                            endDate: "2025-01-19T15:00:00.000Z",
                            confirmed: true,
                            overrideText: "",
                            additionalText: "",
                        },
                    },
                },
            },
            {
                node: {
                    frontmatter: {
                        name: "Season 8",
                        game: "Grim Dawn Community League",
                        url: null,
                        start: {
                            startDate: "2025-10-23T15:00:00.000Z",
                            confirmed: false,
                            overrideText: "2025",
                            additionalText: "",
                        },
                        end: {
                            endDate: "2026-01-31T15:00:00.000Z",
                            confirmed: false,
                            overrideText: "",
                            additionalText: "",
                        },
                    },
                },
            },
            {
                node: {
                    frontmatter: {
                        name: "Fangs of Asterkarn",
                        game: "Grim Dawn",
                        url: "https://www.grimdawn.com/guide/about/fangs-of-asterkarn/",
                        start: {
                            startDate: "2025-10-30T00:00:00.000Z",
                            confirmed: false,
                            overrideText: "2025",
                            additionalText: "No official ladder or seasons",
                        },
                        end: {
                            endDate: "2026-02-07T00:00:00.000Z",
                            confirmed: false,
                            overrideText: "",
                            additionalText: "",
                        },
                    },
                },
            },
            {
                node: {
                    frontmatter: {
                        name: "Forgotten Gods",
                        game: "Grim Dawn",
                        url: "https://www.grimdawn.com/guide/about/Forgotten-Gods/",
                        start: {
                            startDate: "2019-03-27T00:00:00.000Z",
                            confirmed: true,
                            overrideText: "",
                            additionalText: "No official ladder or seasons",
                        },
                        end: {
                            endDate: "2025-10-30T00:00:00.000Z",
                            confirmed: false,
                            overrideText: "",
                            additionalText: "",
                        },
                    },
                },
            },
            {
                node: {
                    frontmatter: {
                        name: "Season 4.5",
                        game: "Hero Siege",
                        url: "",
                        start: {
                            startDate: "2024-08-16T11:00:00.000Z",
                            confirmed: true,
                            overrideText: null,
                            additionalText: "",
                        },
                        end: {
                            endDate: "2024-12-13T11:00:00.000Z",
                            confirmed: true,
                            overrideText: "",
                            additionalText: null,
                        },
                    },
                },
            },
            {
                node: {
                    frontmatter: {
                        name: "Season 6",
                        game: "Hero Siege",
                        url: null,
                        start: {
                            startDate: "2025-03-14T12:00:00.000Z",
                            confirmed: true,
                            overrideText: "",
                            additionalText: "",
                        },
                        end: {
                            endDate: "2025-06-05T23:59:00.000Z",
                            confirmed: true,
                            overrideText: "",
                            additionalText: "",
                        },
                    },
                },
            },
            {
                node: {
                    frontmatter: {
                        name: "Season 5",
                        game: "Hero Siege",
                        url: "",
                        start: {
                            startDate: "2024-12-13T12:00:00.000Z",
                            confirmed: true,
                            overrideText: "",
                            additionalText: "",
                        },
                        end: {
                            endDate: "2025-03-13T11:00:00.000Z",
                            confirmed: false,
                            overrideText: "",
                            additionalText: null,
                        },
                    },
                },
            },
            {
                node: {
                    frontmatter: {
                        name: "Season 7",
                        game: "Hero Siege",
                        url: null,
                        start: {
                            startDate: "2025-06-06T11:00:00.000Z",
                            confirmed: true,
                            overrideText: "",
                            additionalText: "",
                        },
                        end: {
                            endDate: "2025-09-30T23:59:00.000Z",
                            confirmed: false,
                            overrideText: "",
                            additionalText: "",
                        },
                    },
                },
            },
            {
                node: {
                    frontmatter: {
                        name: "Season 1 - Harbingers of Ruin",
                        game: "Last Epoch",
                        url: null,
                        start: {
                            startDate: "2024-07-09T16:00:00.000Z",
                            confirmed: true,
                            overrideText: "",
                            additionalText: "",
                        },
                        end: {
                            endDate: "2024-09-19T16:00:00.000Z",
                            confirmed: true,
                            overrideText: "",
                            additionalText: "",
                        },
                    },
                },
            },
            {
                node: {
                    frontmatter: {
                        name: "Imperial Uprising Cycle Event",
                        game: "Last Epoch",
                        url: "https://forum.lastepoch.com/t/announcing-1-1-refresh-cycle-event-the-imperial-uprising/73532",
                        start: {
                            startDate: "2024-09-19T16:00:00.000Z",
                            confirmed: true,
                            overrideText: "",
                            additionalText: "",
                        },
                        end: {
                            endDate: "2024-10-20T16:00:00.000Z",
                            confirmed: true,
                            overrideText: "",
                            additionalText: "",
                        },
                    },
                },
            },
            {
                node: {
                    frontmatter: {
                        name: "Launch season",
                        game: "Last Epoch",
                        url: null,
                        start: {
                            startDate: "2024-02-21T16:00:00.000Z",
                            confirmed: true,
                            overrideText: null,
                            additionalText: "",
                        },
                        end: {
                            endDate: "2024-07-09T16:00:00.000Z",
                            confirmed: true,
                            overrideText: null,
                            additionalText: null,
                        },
                    },
                },
            },
            {
                node: {
                    frontmatter: {
                        name: "Season 37",
                        game: "Median XL",
                        url: null,
                        start: {
                            startDate: "2024-05-03T02:00:00.000Z",
                            confirmed: true,
                            overrideText: null,
                            additionalText: "",
                        },
                        end: {
                            endDate: "2024-10-31T09:00:00.000Z",
                            confirmed: true,
                            overrideText: null,
                            additionalText: null,
                        },
                    },
                },
            },
            {
                node: {
                    frontmatter: {
                        name: "Season 2 - Tombs of the Erased",
                        game: "Last Epoch",
                        url: "https://forum.lastepoch.com/t/last-epoch-official-teaser-trailer-season-2-tombs-of-the-erased/74739/1",
                        start: {
                            startDate: "2025-04-17T16:00:00.000Z",
                            confirmed: true,
                            overrideText: "",
                            additionalText: "",
                        },
                        end: {
                            endDate: "2025-08-02T00:00:00.000Z",
                            confirmed: false,
                            overrideText: "",
                            additionalText: "",
                        },
                    },
                },
            },
            {
                node: {
                    frontmatter: {
                        name: "Season 38",
                        game: "Median XL",
                        url: null,
                        start: {
                            startDate: "2024-11-01T19:00:00.000Z",
                            confirmed: true,
                            overrideText: null,
                            additionalText: "",
                        },
                        end: {
                            endDate: "2025-06-30T09:00:00.000Z",
                            confirmed: false,
                            overrideText: "",
                            additionalText: "",
                        },
                    },
                },
            },
            {
                node: {
                    frontmatter: {
                        name: "Season 39 (2.11)",
                        game: "Median XL",
                        url: null,
                        start: {
                            startDate: "2025-07-01T09:00:00.000Z",
                            confirmed: false,
                            overrideText: "Early summer",
                            additionalText: "Beta testing right now",
                        },
                        end: {
                            endDate: "2025-10-09T09:00:00.000Z",
                            confirmed: false,
                            overrideText: "",
                            additionalText: "",
                        },
                    },
                },
            },
            {
                node: {
                    frontmatter: {
                        name: "The Breach",
                        game: "No Rest For The Wicked",
                        url: "https://www.youtube.com/watch?v=mpoMEYnvA5Q",
                        start: {
                            startDate: "2025-04-30T15:00:00.000Z",
                            confirmed: true,
                            overrideText: "",
                            additionalText: "",
                        },
                        end: {
                            endDate: "2025-12-31T23:59:00.000Z",
                            confirmed: false,
                            overrideText: "",
                            additionalText: "",
                        },
                    },
                },
            },
            {
                node: {
                    frontmatter: {
                        name: "The Crucible",
                        game: "No Rest For The Wicked",
                        url: null,
                        start: {
                            startDate: "2024-07-25T00:00:00.000Z",
                            confirmed: true,
                            overrideText: "",
                            additionalText: "",
                        },
                        end: {
                            endDate: "2025-04-29T23:59:00.000Z",
                            confirmed: true,
                            overrideText: "",
                            additionalText: "",
                        },
                    },
                },
            },
            {
                node: {
                    frontmatter: {
                        name: "Season 12",
                        game: "Path of Diablo",
                        url: null,
                        start: {
                            startDate: "2024-03-08T22:00:00.000Z",
                            confirmed: true,
                            overrideText: null,
                            additionalText: "",
                        },
                        end: {
                            endDate: "2024-09-08T22:00:00.000Z",
                            confirmed: true,
                            overrideText: "",
                            additionalText: null,
                        },
                    },
                },
            },
            {
                node: {
                    frontmatter: {
                        name: "0.11.0 - Onslaught",
                        game: "Path of Exile",
                        url: "https://www.poewiki.net/wiki/Onslaught_league",
                        start: {
                            startDate: "2013-06-07T20:00:00.000Z",
                            confirmed: true,
                            overrideText: null,
                            additionalText: "",
                        },
                        end: {
                            endDate: "2013-10-07T22:00:00.000Z",
                            confirmed: true,
                            overrideText: null,
                            additionalText: null,
                        },
                    },
                },
            },
            {
                node: {
                    frontmatter: {
                        name: "Season 13",
                        game: "Path of Diablo",
                        url: null,
                        start: {
                            startDate: "2024-11-15T21:00:00.000Z",
                            confirmed: true,
                            overrideText: "",
                            additionalText: "",
                        },
                        end: {
                            endDate: "2025-07-30T22:00:00.000Z",
                            confirmed: false,
                            overrideText: "",
                            additionalText: "",
                        },
                    },
                },
            },
            {
                node: {
                    frontmatter: {
                        name: "1.0.0 - Domination",
                        game: "Path of Exile",
                        url: "https://www.poewiki.net/wiki/Domination_league",
                        start: {
                            startDate: "2013-10-23T20:00:00.000Z",
                            confirmed: true,
                            overrideText: null,
                            additionalText: "",
                        },
                        end: {
                            endDate: "2014-02-23T21:00:00.000Z",
                            confirmed: true,
                            overrideText: null,
                            additionalText: null,
                        },
                    },
                },
            },
            {
                node: {
                    frontmatter: {
                        name: "1.1.0 - Ambush",
                        game: "Path of Exile",
                        url: "https://www.poewiki.net/wiki/Ambush_league",
                        start: {
                            startDate: "2014-03-05T20:00:00.000Z",
                            confirmed: true,
                            overrideText: null,
                            additionalText: "",
                        },
                        end: {
                            endDate: "2014-07-05T21:00:00.000Z",
                            confirmed: true,
                            overrideText: null,
                            additionalText: null,
                        },
                    },
                },
            },
            {
                node: {
                    frontmatter: {
                        name: "1.0.0 - Nemesis",
                        game: "Path of Exile",
                        url: "https://www.poewiki.net/wiki/Nemesis_league",
                        start: {
                            startDate: "2013-10-23T20:00:00.000Z",
                            confirmed: true,
                            overrideText: null,
                            additionalText: "",
                        },
                        end: {
                            endDate: "2014-02-23T21:00:00.000Z",
                            confirmed: true,
                            overrideText: null,
                            additionalText: null,
                        },
                    },
                },
            },
            {
                node: {
                    frontmatter: {
                        name: "1.1.0 - Invasion",
                        game: "Path of Exile",
                        url: "https://www.poewiki.net/wiki/Invasion_league",
                        start: {
                            startDate: "2014-03-05T20:00:00.000Z",
                            confirmed: true,
                            overrideText: null,
                            additionalText: "",
                        },
                        end: {
                            endDate: "2014-07-05T21:00:00.000Z",
                            confirmed: true,
                            overrideText: null,
                            additionalText: null,
                        },
                    },
                },
            },
            {
                node: {
                    frontmatter: {
                        name: "1.2.0 - Rampage",
                        game: "Path of Exile",
                        url: "https://www.poewiki.net/wiki/Rampage_league",
                        start: {
                            startDate: "2014-08-20T20:00:00.000Z",
                            confirmed: true,
                            overrideText: null,
                            additionalText: "",
                        },
                        end: {
                            endDate: "2014-11-20T21:00:00.000Z",
                            confirmed: true,
                            overrideText: null,
                            additionalText: null,
                        },
                    },
                },
            },
            {
                node: {
                    frontmatter: {
                        name: "1.2.0 - Beyond",
                        game: "Path of Exile",
                        url: "https://www.poewiki.net/wiki/Beyond_league",
                        start: {
                            startDate: "2014-08-20T20:00:00.000Z",
                            confirmed: true,
                            overrideText: null,
                            additionalText: "",
                        },
                        end: {
                            endDate: "2014-11-20T21:00:00.000Z",
                            confirmed: true,
                            overrideText: null,
                            additionalText: null,
                        },
                    },
                },
            },
            {
                node: {
                    frontmatter: {
                        name: "1.3.0 - Bloodlines",
                        game: "Path of Exile",
                        url: "https://www.poewiki.net/wiki/Bloodlines_league",
                        start: {
                            startDate: "2014-12-13T20:00:00.000Z",
                            confirmed: true,
                            overrideText: null,
                            additionalText: "",
                        },
                        end: {
                            endDate: "2015-03-24T21:00:00.000Z",
                            confirmed: true,
                            overrideText: null,
                            additionalText: null,
                        },
                    },
                },
            },
            {
                node: {
                    frontmatter: {
                        name: "1.3.0 - Torment",
                        game: "Path of Exile",
                        url: "https://www.poewiki.net/wiki/Torment_league",
                        start: {
                            startDate: "2014-12-13T20:00:00.000Z",
                            confirmed: true,
                            overrideText: null,
                            additionalText: "",
                        },
                        end: {
                            endDate: "2015-03-24T21:00:00.000Z",
                            confirmed: true,
                            overrideText: null,
                            additionalText: null,
                        },
                    },
                },
            },
            {
                node: {
                    frontmatter: {
                        name: "2.0.0 - Tempest",
                        game: "Path of Exile",
                        url: "https://www.poewiki.net/wiki/Tempest_league",
                        start: {
                            startDate: "2015-07-10T20:00:00.000Z",
                            confirmed: true,
                            overrideText: null,
                            additionalText: "",
                        },
                        end: {
                            endDate: "2015-10-02T21:00:00.000Z",
                            confirmed: true,
                            overrideText: null,
                            additionalText: null,
                        },
                    },
                },
            },
            {
                node: {
                    frontmatter: {
                        name: "2.0.0 - Warbands",
                        game: "Path of Exile",
                        url: "https://www.poewiki.net/wiki/Warbands_league",
                        start: {
                            startDate: "2015-07-10T20:00:00.000Z",
                            confirmed: true,
                            overrideText: null,
                            additionalText: "",
                        },
                        end: {
                            endDate: "2015-10-02T21:00:00.000Z",
                            confirmed: true,
                            overrideText: null,
                            additionalText: null,
                        },
                    },
                },
            },
            {
                node: {
                    frontmatter: {
                        name: "2.2.0 - Perandus",
                        game: "Path of Exile",
                        url: "https://www.poewiki.net/wiki/Perandus_league",
                        start: {
                            startDate: "2016-03-04T20:00:00.000Z",
                            confirmed: true,
                            overrideText: null,
                            additionalText: "",
                        },
                        end: {
                            endDate: "2016-05-30T21:00:00.000Z",
                            confirmed: true,
                            overrideText: null,
                            additionalText: null,
                        },
                    },
                },
            },
            {
                node: {
                    frontmatter: {
                        name: "2.1.0 - Talisman",
                        game: "Path of Exile",
                        url: "https://www.poewiki.net/wiki/Talisman_league",
                        start: {
                            startDate: "2015-12-11T20:00:00.000Z",
                            confirmed: true,
                            overrideText: null,
                            additionalText: "",
                        },
                        end: {
                            endDate: "2016-03-04T21:00:00.000Z",
                            confirmed: true,
                            overrideText: null,
                            additionalText: null,
                        },
                    },
                },
            },
            {
                node: {
                    frontmatter: {
                        name: "2.3.0 - Prophecy",
                        game: "Path of Exile",
                        url: "https://www.poewiki.net/wiki/Prophecy_league",
                        start: {
                            startDate: "2016-06-03T20:00:00.000Z",
                            confirmed: true,
                            overrideText: null,
                            additionalText: "",
                        },
                        end: {
                            endDate: "2016-08-29T21:00:00.000Z",
                            confirmed: true,
                            overrideText: null,
                            additionalText: null,
                        },
                    },
                },
            },
            {
                node: {
                    frontmatter: {
                        name: "2.5.0 - Breach",
                        game: "Path of Exile",
                        url: "https://www.poewiki.net/wiki/Breach_league",
                        start: {
                            startDate: "2016-12-02T20:00:00.000Z",
                            confirmed: true,
                            overrideText: null,
                            additionalText: "",
                        },
                        end: {
                            endDate: "2017-02-27T21:00:00.000Z",
                            confirmed: true,
                            overrideText: null,
                            additionalText: null,
                        },
                    },
                },
            },
            {
                node: {
                    frontmatter: {
                        name: "0.2.0 - Dawn of the Hunt",
                        game: "Path of Exile 2",
                        url: "https://www.pathofexile.com/forum/view-thread/3734468",
                        start: {
                            startDate: "2025-04-04T19:00:00.000Z",
                            confirmed: true,
                            overrideText: "",
                            additionalText: "",
                        },
                        end: {
                            endDate: "2025-08-10T00:00:00.000Z",
                            confirmed: false,
                            overrideText: "est. August",
                            additionalText: "",
                        },
                    },
                },
            },
            {
                node: {
                    frontmatter: {
                        name: "2.4.0 - Essence",
                        game: "Path of Exile",
                        url: "https://www.poewiki.net/wiki/Essence_league",
                        start: {
                            startDate: "2016-09-02T20:00:00.000Z",
                            confirmed: true,
                            overrideText: null,
                            additionalText: "",
                        },
                        end: {
                            endDate: "2016-11-28T21:00:00.000Z",
                            confirmed: true,
                            overrideText: null,
                            additionalText: null,
                        },
                    },
                },
            },
            {
                node: {
                    frontmatter: {
                        name: "2.6.0 - Legacy",
                        game: "Path of Exile",
                        url: "https://www.poewiki.net/wiki/Legacy_league",
                        start: {
                            startDate: "2017-03-03T00:00:00.000Z",
                            confirmed: true,
                            overrideText: null,
                            additionalText: "",
                        },
                        end: {
                            endDate: "2017-07-31T21:00:00.000Z",
                            confirmed: true,
                            overrideText: null,
                            additionalText: null,
                        },
                    },
                },
            },
            {
                node: {
                    frontmatter: {
                        name: "Early Access - Launch",
                        game: "Path of Exile 2",
                        url: "https://pathofexile2.com/",
                        start: {
                            startDate: "2024-12-06T19:00:00.000Z",
                            confirmed: true,
                            overrideText: null,
                            additionalText: "",
                        },
                        end: {
                            endDate: "2025-04-04T00:00:00.000Z",
                            confirmed: false,
                            overrideText: "",
                            additionalText: "",
                        },
                    },
                },
            },
            {
                node: {
                    frontmatter: {
                        name: "3.1.0 - Abyss",
                        game: "Path of Exile",
                        url: "https://www.poewiki.net/wiki/Abyss_league",
                        start: {
                            startDate: "2017-12-08T20:00:00.000Z",
                            confirmed: true,
                            overrideText: null,
                            additionalText: "",
                        },
                        end: {
                            endDate: "2018-02-26T21:00:00.000Z",
                            confirmed: true,
                            overrideText: null,
                            additionalText: null,
                        },
                    },
                },
            },
            {
                node: {
                    frontmatter: {
                        name: "3.0.0 - Harbinger",
                        game: "Path of Exile",
                        url: "https://www.poewiki.net/wiki/Harbinger_league",
                        start: {
                            startDate: "2017-08-04T20:00:00.000Z",
                            confirmed: true,
                            overrideText: null,
                            additionalText: "",
                        },
                        end: {
                            endDate: "2017-12-04T21:00:00.000Z",
                            confirmed: true,
                            overrideText: null,
                            additionalText: null,
                        },
                    },
                },
            },
            {
                node: {
                    frontmatter: {
                        name: "3.11.0 - Harvest",
                        game: "Path of Exile",
                        url: "https://www.poewiki.net/wiki/Harvest_league",
                        start: {
                            startDate: "2020-06-19T20:00:00.000Z",
                            confirmed: true,
                            overrideText: null,
                            additionalText: "",
                        },
                        end: {
                            endDate: "2020-09-14T21:00:00.000Z",
                            confirmed: true,
                            overrideText: null,
                            additionalText: null,
                        },
                    },
                },
            },
            {
                node: {
                    frontmatter: {
                        name: "3.12.0 - Heist",
                        game: "Path of Exile",
                        url: "https://www.poewiki.net/wiki/Heist_league",
                        start: {
                            startDate: "2020-09-18T20:00:00.000Z",
                            confirmed: true,
                            overrideText: null,
                            additionalText: "",
                        },
                        end: {
                            endDate: "2021-01-11T21:00:00.000Z",
                            confirmed: true,
                            overrideText: null,
                            additionalText: null,
                        },
                    },
                },
            },
            {
                node: {
                    frontmatter: {
                        name: "3.10.0 - Delirium",
                        game: "Path of Exile",
                        url: "https://www.poewiki.net/wiki/Delirium_league",
                        start: {
                            startDate: "2020-03-13T00:00:00.000Z",
                            confirmed: true,
                            overrideText: null,
                            additionalText: "",
                        },
                        end: {
                            endDate: "2020-06-15T00:00:00.000Z",
                            confirmed: true,
                            overrideText: null,
                            additionalText: null,
                        },
                    },
                },
            },
            {
                node: {
                    frontmatter: {
                        name: "3.13.0 - Ritual",
                        game: "Path of Exile",
                        url: "https://www.poewiki.net/wiki/Ritual_league",
                        start: {
                            startDate: "2021-01-15T20:00:00.000Z",
                            confirmed: true,
                            overrideText: null,
                            additionalText: "",
                        },
                        end: {
                            endDate: "2021-04-12T21:00:00.000Z",
                            confirmed: true,
                            overrideText: null,
                            additionalText: null,
                        },
                    },
                },
            },
            {
                node: {
                    frontmatter: {
                        name: "3.15.0 - Expedition",
                        game: "Path of Exile",
                        url: "https://www.poewiki.net/wiki/Expedition_league",
                        start: {
                            startDate: "2021-07-23T20:00:00.000Z",
                            confirmed: true,
                            overrideText: null,
                            additionalText: "",
                        },
                        end: {
                            endDate: "2021-10-18T21:00:00.000Z",
                            confirmed: true,
                            overrideText: null,
                            additionalText: null,
                        },
                    },
                },
            },
            {
                node: {
                    frontmatter: {
                        name: "3.14.0 - Ultimatum",
                        game: "Path of Exile",
                        url: "https://www.poewiki.net/wiki/Ultimatum_league",
                        start: {
                            startDate: "2021-04-16T20:00:00.000Z",
                            confirmed: true,
                            overrideText: null,
                            additionalText: "",
                        },
                        end: {
                            endDate: "2021-07-19T21:00:00.000Z",
                            confirmed: true,
                            overrideText: null,
                            additionalText: null,
                        },
                    },
                },
            },
            {
                node: {
                    frontmatter: {
                        name: "3.16.0 - Scourge",
                        game: "Path of Exile",
                        url: "https://www.poewiki.net/wiki/Scourge_league",
                        start: {
                            startDate: "2021-10-22T20:00:00.000Z",
                            confirmed: true,
                            overrideText: null,
                            additionalText: "",
                        },
                        end: {
                            endDate: "2022-02-01T21:00:00.000Z",
                            confirmed: true,
                            overrideText: null,
                            additionalText: null,
                        },
                    },
                },
            },
            {
                node: {
                    frontmatter: {
                        name: "3.17.0 - Archnemesis",
                        game: "Path of Exile",
                        url: "https://www.poewiki.net/wiki/Archnemesis_league",
                        start: {
                            startDate: "2022-02-04T20:00:00.000Z",
                            confirmed: true,
                            overrideText: null,
                            additionalText: "",
                        },
                        end: {
                            endDate: "2022-05-10T21:00:00.000Z",
                            confirmed: true,
                            overrideText: null,
                            additionalText: null,
                        },
                    },
                },
            },
            {
                node: {
                    frontmatter: {
                        name: "3.19.0 - Kalandra",
                        game: "Path of Exile",
                        url: "https://www.poewiki.net/wiki/Kalandra_league",
                        start: {
                            startDate: "2022-08-19T20:00:00.000Z",
                            confirmed: true,
                            overrideText: null,
                            additionalText: "",
                        },
                        end: {
                            endDate: "2022-12-06T20:00:00.000Z",
                            confirmed: true,
                            overrideText: null,
                            additionalText: null,
                        },
                    },
                },
            },
            {
                node: {
                    frontmatter: {
                        name: "3.18.0 - Sentinel",
                        game: "Path of Exile",
                        url: "https://www.poewiki.net/wiki/Sentinel_league",
                        start: {
                            startDate: "2022-05-13T20:00:00.000Z",
                            confirmed: true,
                            overrideText: null,
                            additionalText: "",
                        },
                        end: {
                            endDate: "2022-08-16T21:00:00.000Z",
                            confirmed: true,
                            overrideText: null,
                            additionalText: null,
                        },
                    },
                },
            },
            {
                node: {
                    frontmatter: {
                        name: "3.2.0 - Bestiary",
                        game: "Path of Exile",
                        url: "https://www.poewiki.net/wiki/Bestiary_league",
                        start: {
                            startDate: "2018-03-02T20:00:00.000Z",
                            confirmed: true,
                            overrideText: null,
                            additionalText: "",
                        },
                        end: {
                            endDate: "2018-05-28T21:00:00.000Z",
                            confirmed: true,
                            overrideText: null,
                            additionalText: null,
                        },
                    },
                },
            },
            {
                node: {
                    frontmatter: {
                        name: "3.20.0 - Sanctum",
                        game: "Path of Exile",
                        url: "https://www.poewiki.net/wiki/Sanctum_league",
                        start: {
                            startDate: "2022-12-09T20:00:00.000Z",
                            confirmed: true,
                            overrideText: null,
                            additionalText: "",
                        },
                        end: {
                            endDate: "2023-04-04T21:00:00.000Z",
                            confirmed: true,
                            overrideText: null,
                            additionalText: null,
                        },
                    },
                },
            },
            {
                node: {
                    frontmatter: {
                        name: "3.21.0 - Crucible",
                        game: "Path of Exile",
                        url: "https://www.poewiki.net/wiki/Crucible_league",
                        start: {
                            startDate: "2023-04-07T20:00:00.000Z",
                            confirmed: true,
                            overrideText: null,
                            additionalText: "",
                        },
                        end: {
                            endDate: "2023-08-15T21:00:00.000Z",
                            confirmed: true,
                            overrideText: null,
                            additionalText: null,
                        },
                    },
                },
            },
            {
                node: {
                    frontmatter: {
                        name: "3.22.0 - Ancestor",
                        game: "Path of Exile",
                        url: "https://www.poewiki.net/wiki/Ancestor_league",
                        start: {
                            startDate: "2023-08-18T20:00:00.000Z",
                            confirmed: true,
                            overrideText: null,
                            additionalText: "",
                        },
                        end: {
                            endDate: "2023-12-05T21:00:00.000Z",
                            confirmed: true,
                            overrideText: null,
                            additionalText: null,
                        },
                    },
                },
            },
            {
                node: {
                    frontmatter: {
                        name: "3.25 - Settlers of Kalguur",
                        game: "Path of Exile",
                        url: "https://www.poewiki.net/wiki/Settlers_league",
                        start: {
                            startDate: "2024-07-26T18:00:00.000Z",
                            confirmed: true,
                            overrideText: null,
                            additionalText: "",
                        },
                        end: {
                            endDate: "2025-06-13T20:00:00.000Z",
                            confirmed: false,
                            overrideText: null,
                            additionalText: null,
                        },
                    },
                },
            },
            {
                node: {
                    frontmatter: {
                        name: "3.24.0 - Necropolis",
                        game: "Path of Exile",
                        url: "https://www.poewiki.net/wiki/Necropolis_league",
                        start: {
                            startDate: "2024-03-29T18:00:00.000Z",
                            confirmed: true,
                            overrideText: null,
                            additionalText: "",
                        },
                        end: {
                            endDate: "2024-07-23T22:00:00.000Z",
                            confirmed: true,
                            overrideText: null,
                            additionalText: null,
                        },
                    },
                },
            },
            {
                node: {
                    frontmatter: {
                        name: "3.23.0 - Affliction",
                        game: "Path of Exile",
                        url: "https://www.poewiki.net/wiki/Affliction_league",
                        start: {
                            startDate: "2023-12-08T19:00:00.000Z",
                            confirmed: true,
                            overrideText: null,
                            additionalText: "",
                        },
                        end: {
                            endDate: "2024-03-26T21:00:00.000Z",
                            confirmed: true,
                            overrideText: null,
                            additionalText: null,
                        },
                    },
                },
            },
            {
                node: {
                    frontmatter: {
                        name: "3.26 - Secrets of The Atlas",
                        game: "Path of Exile",
                        url: "https://www.pathofexile.com/forum/view-thread/3783838",
                        start: {
                            startDate: "2025-06-13T20:00:00.000Z",
                            confirmed: true,
                            overrideText: "",
                            additionalText: "",
                        },
                        end: {
                            endDate: "2025-10-13T00:00:00.000Z",
                            confirmed: false,
                            overrideText: "est. October",
                            additionalText: null,
                        },
                    },
                },
            },
            {
                node: {
                    frontmatter: {
                        name: "3.3.0 - Incursion",
                        game: "Path of Exile",
                        url: "https://www.poewiki.net/wiki/Incursion_league",
                        start: {
                            startDate: "2018-06-01T00:00:00.000Z",
                            confirmed: true,
                            overrideText: null,
                            additionalText: "",
                        },
                        end: {
                            endDate: "2018-08-27T21:00:00.000Z",
                            confirmed: true,
                            overrideText: null,
                            additionalText: null,
                        },
                    },
                },
            },
            {
                node: {
                    frontmatter: {
                        name: "3.4.0 - Delve",
                        game: "Path of Exile",
                        url: "https://www.poewiki.net/wiki/Delve_league",
                        start: {
                            startDate: "2018-08-31T00:00:00.000Z",
                            confirmed: true,
                            overrideText: null,
                            additionalText: "",
                        },
                        end: {
                            endDate: "2018-12-03T21:00:00.000Z",
                            confirmed: true,
                            overrideText: null,
                            additionalText: null,
                        },
                    },
                },
            },
            {
                node: {
                    frontmatter: {
                        name: "3.5.0 - Betrayal",
                        game: "Path of Exile",
                        url: "https://www.poewiki.net/wiki/Betrayal_league",
                        start: {
                            startDate: "2018-12-07T00:00:00.000Z",
                            confirmed: true,
                            overrideText: null,
                            additionalText: "",
                        },
                        end: {
                            endDate: "2019-03-04T21:00:00.000Z",
                            confirmed: true,
                            overrideText: null,
                            additionalText: null,
                        },
                    },
                },
            },
            {
                node: {
                    frontmatter: {
                        name: "3.7.0 - Legion",
                        game: "Path of Exile",
                        url: "https://www.poewiki.net/wiki/Legion_league",
                        start: {
                            startDate: "2019-06-07T00:00:00.000Z",
                            confirmed: true,
                            overrideText: null,
                            additionalText: "",
                        },
                        end: {
                            endDate: "2019-09-03T00:00:00.000Z",
                            confirmed: true,
                            overrideText: null,
                            additionalText: null,
                        },
                    },
                },
            },
            {
                node: {
                    frontmatter: {
                        name: "3.6.0 - Synthesis",
                        game: "Path of Exile",
                        url: "https://www.poewiki.net/wiki/Synthesis_league",
                        start: {
                            startDate: "2019-03-08T00:00:00.000Z",
                            confirmed: true,
                            overrideText: null,
                            additionalText: "",
                        },
                        end: {
                            endDate: "2019-06-03T21:00:00.000Z",
                            confirmed: true,
                            overrideText: null,
                            additionalText: null,
                        },
                    },
                },
            },
            {
                node: {
                    frontmatter: {
                        name: "3.9.0 - Metamorph",
                        game: "Path of Exile",
                        url: "https://www.poewiki.net/wiki/Metamorph_league",
                        start: {
                            startDate: "2019-12-13T20:00:00.000Z",
                            confirmed: true,
                            overrideText: null,
                            additionalText: "",
                        },
                        end: {
                            endDate: "2020-03-09T21:00:00.000Z",
                            confirmed: true,
                            overrideText: null,
                            additionalText: null,
                        },
                    },
                },
            },
            {
                node: {
                    frontmatter: {
                        name: "3.8.0 - Blight",
                        game: "Path of Exile",
                        url: "https://www.poewiki.net/wiki/Blight_league",
                        start: {
                            startDate: "2019-09-06T00:00:00.000Z",
                            confirmed: true,
                            overrideText: null,
                            additionalText: "",
                        },
                        end: {
                            endDate: "2019-12-09T21:00:00.000Z",
                            confirmed: true,
                            overrideText: null,
                            additionalText: null,
                        },
                    },
                },
            },
            {
                node: {
                    frontmatter: {
                        name: "Season 10 - Desecration",
                        game: "Project Diablo 2",
                        url: null,
                        start: {
                            startDate: "2024-10-25T17:00:00.000Z",
                            confirmed: true,
                            overrideText: "",
                            additionalText: "",
                        },
                        end: {
                            endDate: "2025-04-30T23:59:00.000Z",
                            confirmed: true,
                            overrideText: "",
                            additionalText: "",
                        },
                    },
                },
            },
            {
                node: {
                    frontmatter: {
                        name: "Season 11 - Prosperity",
                        game: "Project Diablo 2",
                        url: "https://www.reddit.com/r/ProjectDiablo2/comments/1k36e3i/project_diablo_2_season_11_dev_stream_2_recap/",
                        start: {
                            startDate: "2025-05-16T17:00:00.000Z",
                            confirmed: true,
                            overrideText: "",
                            additionalText: "Open Beta May 12-13, Closed Beta May 3-11",
                        },
                        end: {
                            endDate: "2025-11-30T23:59:00.000Z",
                            confirmed: false,
                            overrideText: "est. December",
                            additionalText: "",
                        },
                    },
                },
            },
            {
                node: {
                    frontmatter: {
                        name: "Season 9 - Anarchy",
                        game: "Project Diablo 2",
                        url: null,
                        start: {
                            startDate: "2024-04-12T17:00:00.000Z",
                            confirmed: true,
                            overrideText: null,
                            additionalText: "",
                        },
                        end: {
                            endDate: "2024-10-25T17:00:00.000Z",
                            confirmed: false,
                            overrideText: "",
                            additionalText: null,
                        },
                    },
                },
            },
            {
                node: {
                    frontmatter: {
                        name: "Ladder Reset: 12th July",
                        game: "Slash Diablo",
                        url: null,
                        start: {
                            startDate: "2024-07-12T23:00:00.000Z",
                            confirmed: true,
                            overrideText: "",
                            additionalText: "",
                        },
                        end: {
                            endDate: "2024-11-23T00:00:00.000Z",
                            confirmed: true,
                            overrideText: "",
                            additionalText: "",
                        },
                    },
                },
            },
            {
                node: {
                    frontmatter: {
                        name: "Ladder Reset: 22nd November",
                        game: "Slash Diablo",
                        url: null,
                        start: {
                            startDate: "2024-11-23T00:00:00.000Z",
                            confirmed: true,
                            overrideText: "",
                            additionalText: "",
                        },
                        end: {
                            endDate: "2025-03-21T23:59:00.000Z",
                            confirmed: true,
                            overrideText: "",
                            additionalText: "",
                        },
                    },
                },
            },
            {
                node: {
                    frontmatter: {
                        name: "Ladder Reset: Q1 2025",
                        game: "Slash Diablo",
                        url: null,
                        start: {
                            startDate: "2025-03-22T00:00:00.000Z",
                            confirmed: true,
                            overrideText: "",
                            additionalText: "",
                        },
                        end: {
                            endDate: "2025-07-22T23:00:00.000Z",
                            confirmed: false,
                            overrideText: "est. July",
                            additionalText: "",
                        },
                    },
                },
            },
            {
                node: {
                    frontmatter: {
                        name: "1.0.0 Release",
                        game: "The Slormancer",
                        url: "https://store.steampowered.com/news/app/1104280/view/532096041998091312",
                        start: {
                            startDate: "2025-05-13T17:00:00.000Z",
                            confirmed: true,
                            overrideText: "",
                            additionalText: "Single player",
                        },
                        end: {
                            endDate: "2025-08-21T17:00:00.000Z",
                            confirmed: false,
                            overrideText: "",
                            additionalText: "",
                        },
                    },
                },
            },
            {
                node: {
                    frontmatter: {
                        name: "0.9.0 Early access",
                        game: "The Slormancer",
                        url: "https://store.steampowered.com/news/app/1104280/view/4170974735564951688",
                        start: {
                            startDate: "2024-06-24T17:00:00.000Z",
                            confirmed: true,
                            overrideText: "",
                            additionalText: "Single player",
                        },
                        end: {
                            endDate: "2025-05-13T16:59:00.000Z",
                            confirmed: true,
                            overrideText: "",
                            additionalText: "",
                        },
                    },
                },
            },
            {
                node: {
                    frontmatter: {
                        name: "Early Access",
                        game: "Titan Quest II",
                        url: null,
                        start: {
                            startDate: "2025-09-02T00:00:00.000Z",
                            confirmed: false,
                            overrideText: "2025",
                            additionalText: "No official ladder/season confirmed",
                        },
                        end: {
                            endDate: "2025-12-11T00:00:00.000Z",
                            confirmed: false,
                            overrideText: "",
                            additionalText: "",
                        },
                    },
                },
            },
            {
                node: {
                    frontmatter: {
                        name: "SS6 Frozen Canvas",
                        game: "Torchlight: Infinite",
                        url: null,
                        start: {
                            startDate: "2024-10-24T02:00:00.000Z",
                            confirmed: true,
                            overrideText: "",
                            additionalText: "",
                        },
                        end: {
                            endDate: "2025-01-09T02:00:00.000Z",
                            confirmed: true,
                            overrideText: "",
                            additionalText: "",
                        },
                    },
                },
            },
            {
                node: {
                    frontmatter: {
                        name: "SS7 Arcana",
                        game: "Torchlight: Infinite",
                        url: null,
                        start: {
                            startDate: "2025-01-09T02:00:00.000Z",
                            confirmed: true,
                            overrideText: "",
                            additionalText: "",
                        },
                        end: {
                            endDate: "2025-04-17T23:59:00.000Z",
                            confirmed: true,
                            overrideText: "",
                            additionalText: "",
                        },
                    },
                },
            },
            {
                node: {
                    frontmatter: {
                        name: "SS5 Clockwork Ballet",
                        game: "Torchlight: Infinite",
                        url: null,
                        start: {
                            startDate: "2024-07-05T02:00:00.000Z",
                            confirmed: true,
                            overrideText: null,
                            additionalText: "",
                        },
                        end: {
                            endDate: "2024-10-24T02:00:00.000Z",
                            confirmed: true,
                            overrideText: "",
                            additionalText: null,
                        },
                    },
                },
            },
            {
                node: {
                    frontmatter: {
                        name: "Season 5: Exodium",
                        game: "Undecember",
                        url: null,
                        start: {
                            startDate: "2024-07-18T05:00:00.000Z",
                            confirmed: true,
                            overrideText: null,
                            additionalText: "",
                        },
                        end: {
                            endDate: "2024-12-12T05:00:00.000Z",
                            confirmed: false,
                            overrideText: "est. end of 2024",
                            additionalText: null,
                        },
                    },
                },
            },
            {
                node: {
                    frontmatter: {
                        name: "SS8 Sandlord",
                        game: "Torchlight: Infinite",
                        url: null,
                        start: {
                            startDate: "2025-04-18T02:00:00.000Z",
                            confirmed: true,
                            overrideText: "",
                            additionalText: "",
                        },
                        end: {
                            endDate: "2025-07-30T23:59:00.000Z",
                            confirmed: false,
                            overrideText: "est. July/August",
                            additionalText: "",
                        },
                    },
                },
            },
            {
                node: {
                    frontmatter: {
                        name: "Season 8: Starwalker",
                        game: "Undecember",
                        url: "https://ud.floor.line.games/us/bbsCmn/detail/1745810614068020586",
                        start: {
                            startDate: "2025-05-08T12:00:00.000Z",
                            confirmed: true,
                            overrideText: "",
                            additionalText: "",
                        },
                        end: {
                            endDate: "2025-09-15T00:00:00.000Z",
                            confirmed: false,
                            overrideText: "est. August/September",
                            additionalText: "",
                        },
                    },
                },
            },
            {
                node: {
                    frontmatter: {
                        name: "Season 7: Trials of Power",
                        game: "Undecember",
                        url: null,
                        start: {
                            startDate: "2025-01-10T02:00:00.000Z",
                            confirmed: true,
                            overrideText: "",
                            additionalText: "",
                        },
                        end: {
                            endDate: "2025-05-08T02:00:00.000Z",
                            confirmed: true,
                            overrideText: "",
                            additionalText: "",
                        },
                    },
                },
            },
            {
                node: {
                    frontmatter: {
                        name: "Re Season",
                        game: "Undecember",
                        url: null,
                        start: {
                            startDate: "2024-11-07T03:30:00.000Z",
                            confirmed: true,
                            overrideText: "",
                            additionalText: "",
                        },
                        end: {
                            endDate: "2025-01-09T15:00:00.000Z",
                            confirmed: true,
                            overrideText: "",
                            additionalText: "",
                        },
                    },
                },
            },
            {
                node: {
                    frontmatter: {
                        name: "Invaders of Oakveil",
                        game: "V Rising",
                        url: "https://playvrising.com/oakveil",
                        start: {
                            startDate: "2025-04-28T17:00:00.000Z",
                            confirmed: true,
                            overrideText: "",
                            additionalText: "",
                        },
                        end: {
                            endDate: "2025-08-06T17:00:00.000Z",
                            confirmed: false,
                            overrideText: "",
                            additionalText: "",
                        },
                    },
                },
            },
        ],
    },
    faq: {
        edges: [
            {
                node: {
                    frontmatter: {
                        title: "How can I support your work?",
                        content:
                            "If you would like to support me financially, you can do it by donating a coffee - via the yellow cup button. You can also consider contributing to the development or moderation of this site. You contact me on **[Discord](https://discord.gg/39mTbjkePg)** or write an **[email](mailto:arpgtimeline@ayronk.com)**. All forms of feedback are vastly appreciated.",
                        order: 800,
                    },
                },
            },
            {
                node: {
                    frontmatter: {
                        title: "How does aRPG Timeline work?",
                        content:
                            "We gather the most popular aRPG games and collect information about their current and future seasons. These games are then presented in a form of timeline widgets. We present launch and end dates of relevant seasons for various games.",
                        order: 200,
                    },
                },
            },
            {
                node: {
                    frontmatter: {
                        title: "Could you add a new feature?",
                        content:
                            "Certainly! Please submit your suggestions as an issue on **[our GitHub page](https://github.com/AyronK/arpg-timeline/issues)**, contact me on **[Discord](https://discord.gg/39mTbjkePg)** or write an **[email](mailto:arpgtimeline@ayronk.com)**.",
                        order: 700,
                    },
                },
            },
            {
                node: {
                    frontmatter: {
                        title: "Am I the product? Does the website have a hidden cost?",
                        content:
                            "**Absolutely not!** This website will always remain free of charge, without ads or monetization. My only support comes from your donations and kind words, which I truly appreciate. I prioritize your privacy and providing high-quality free content, and as long as I can manage it myself, I will continue to do so. If I ever request money, it will be for optional features that may incur infrastructure costs, such as Discord notifications or newsletters. These features will not affect the current website experience and incoming incremental updates to build the best season tracker that will ever exist!",
                        order: 900,
                    },
                },
            },
            {
                node: {
                    frontmatter: {
                        title: "Could you add a new game to the list?",
                        content:
                            "Absolutely! As long as it is an aRPG with a seasonal game cycle. Please submit your suggestions as an issue on **[our GitHub page](https://github.com/AyronK/arpg-timeline/issues)**, contact me on **[Discord](https://discord.gg/39mTbjkePg)** or write an **[email](mailto:arpgtimeline@ayronk.com)**.",
                        order: 700,
                    },
                },
            },
            {
                node: {
                    frontmatter: {
                        title: "How is the website updated?",
                        content:
                            "We monitor a range of channels, including official websites, wikis, Reddit threads, Steam news, and other carefully selected sources. Moderators are notified on Discord of anything relevant to current or upcoming seasons. To streamline the process, notifications are first reviewed by an AI model, reducing manual effort. However, **a human always performs the final verification**.",
                        order: 600,
                    },
                },
            },
            {
                node: {
                    frontmatter: {
                        title: "Are dates displayed in my local time?",
                        content:
                            "Yes! All dates are displayed in the local time of your machine. You can even add an event to your favorite calendar app!",
                        order: 400,
                    },
                },
            },
            {
                node: {
                    frontmatter: {
                        title: "How often is this site updated?",
                        content:
                            "The site is updated promptly upon receiving official season announcement. You can expect updates for upcoming seasons within 48h of their availability to the public. End dates may experience slight delays as they are less prominently advertised by game publishers.",
                        order: 300,
                    },
                },
            },
            {
                node: {
                    frontmatter: {
                        title: 'What does the "COMMUNITY" tag mean?',
                        content:
                            'The "COMMUNITY" tag indicates that a game or cycle is not officially recognized or supported by its original publishers. This means it is created by fans or third parties without the endorsement or active support of the official game developers or publishers. As a result, the original publishers do not provide support for "COMMUNITY" content, and any issues or questions should be directed to the creators or the community that developed it.',
                        order: 500,
                    },
                },
            },
            {
                node: {
                    frontmatter: {
                        title: "What is a season tracker?",
                        content:
                            "ARPG is a very special genre. The large part of these games' community are the same people cycling between new seasons. If you are one of those people playing aRPGs for a couple of days or weeks each cycle, this site can help you plan your time in regard of new season launch dates!",
                        order: 100,
                    },
                },
            },
            {
                node: {
                    frontmatter: {
                        title: "Is the website broken?",
                        content:
                            "I am sorry you experienced a bug that worried you enough to consider reading FAQ. Please submit your issue on **[our GitHub page](https://github.com/AyronK/arpg-timeline/issues)**, contact me on **[Discord](https://discord.gg/39mTbjkePg)** or write an **[email](mailto:arpgtimeline@ayronk.com)**.",
                        order: 750,
                    },
                },
            },
        ],
    },
    liveStreamsOnTwitch: {
        edges: [
            {
                node: {
                    frontmatter: {
                        game: "path-of-exile",
                        platform: "path-of-exile-twitch",
                        date: "2025-06-05T20:00:00.000Z",
                        name: "3.26 Expansion Announcement",
                        slug: null,
                    },
                },
            },
        ],
    },
    twitchChannels: {
        edges: [
            {
                node: {
                    frontmatter: {
                        game: "path-of-exile",
                        category: "path-of-exile",
                        channel: "pathofexile",
                    },
                },
            },
            {
                node: {
                    frontmatter: {
                        game: "path-of-exile-2",
                        category: "path-of-exile-2",
                        channel: "pathofexile",
                    },
                },
            },
        ],
    },
    toasts: {
        edges: [
            {
                node: {
                    frontmatter: {
                        title: "Test",
                        description: "Text",
                        withLogo: true,
                        duration: 5000,
                        order: 1,
                    },
                },
            },
        ],
    },
};
