import argparse
import os
import shutil


def copy_file(target):
    src_fn = f"api_common.{target}.ts"
    p = os.path.abspath(os.path.join(os.path.dirname(__file__), "src/api"))
    src = os.path.join(p, src_fn)
    dst = os.path.join(p, "api_common.ts")
    print(f"Moving {src} to {dst} to configure for {target}")
    shutil.copyfile(src,dst)
    print("Done")


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("target",
                        help="system to run/build. web or electron",
                        choices=["web", "electron"])
    args = parser.parse_args()
    copy_file(args.target)


if __name__ == "__main__":
    main()
