def main():
    data = {}
    for i in range(1, 200):
        data["".join(["arg", str(i)])] = str(i)

    print data, "\n"


if __name__ == '__main__':
    main()
