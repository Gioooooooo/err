function memo(min: number) {
  const myCache = new Map<number, any>();
  return function (
    target: Object,
    key: string | symbol | number,
    descriptor: PropertyDescriptor
  ) {
    const original = descriptor.value;

    descriptor.value = function (...args: any[]) {
      const id = args[0];

      if (myCache.has(id)) {
        return Promise.resolve(myCache.get(id));
      }

      return original.apply(this, args).then((data: any) => {
        myCache.set(id, data);
      }); // not to lose context we use apply or maybe call also
    };
    return descriptor; // descriptor aris puncqciis configuracia getUserById-is am shemtxvevashi
  };
}

const getUserById = (id: number): Promise<User> =>
  new Promise((resolve) => {
    const users = [
      {
        id: 1,
        firstname: "Giorgi",
        lastname: "Bazerashvili",
        age: 26,
        isActive: true,
      },
      {
        id: 2,
        firstname: "Giorgi",
        lastname: "Bazerashvili",
        age: 27,
        isActive: false,
      },
      {
        id: 3,
        firstname: "Giorgi",
        lastname: "Bazerashvili",
        age: 28,
        isActive: true,
      },
    ];
    setTimeout(() => {
      resolve(users.find((u) => u.id == id));
    }, 3000);
  });
interface User {
  id: number;
  firstname: string;
  lastname: string;
  age: number;
  isActive: boolean;
}

class UsersService {
  @memo(1) // <- Implement This Decorator
  getUserById(id: number): Promise<User> {
    return getUserById(id);
  }
}

const usersService = new UsersService();
const btn: HTMLElement | null = document.getElementById("btn");
const input = document.getElementById("userId");
const loading: HTMLElement | null = document.getElementById("loading");

if (btn) {
  btn.addEventListener("click", async () => {
    if (loading) {
      loading.textContent = "loading";
      await usersService
        .getUserById(+(input as HTMLInputElement).value)
        .then((x) => console.log(x));
      loading.innerHTML = "";
    }
  });
}
