export class Pollen {
  constructor(name) {
    this.name = name;
    this.intervals = {
      _0h: 0,
      _1h: 0,
      _2h: 0,
      _3h: 0,
      _4h: 0,
      _5h: 0,
      _6h: 0,
      _7h: 0,
      _8h: 0,
      _9h: 0,
      _10h: 0,
      _11h: 0,
      _12h: 0,
      _13h: 0,
      _14h: 0,
      _15h: 0,
      _16h: 0,
      _17h: 0,
      _18h: 0,
      _19h: 0,
      _20h: 0,
      _21h: 0,
      _22h: 0,
      _23h: 0,
    };
  }

  toString() {
    return this.name + ": " + JSON.stringify(this.intervals);
  }
}

// Firestore data converter
export const pollenConverter = {
  toFirestore: (pollen) => {
    return {
      name: pollen.name,
      intervals: pollen.intervals,
    };
  },
  fromFirestore: (snapshot, options) => {
    const data = snapshot.data(options);
    return {
      id: snapshot.id,
      name: data.name,
      intervals: data.intervals,
    };
  },
};
