TARGET dafny-rust
VERI_VERSION 0.0.2

class Element:
    serial: nat
    data: string

def is_sorted(lst: list[Element]) -> bool:
    return match lst:
        case []: True
        case [_]: True
        case [hd1, hd2, *tl]: hd1.serial <= hd2.serial and is_sorted([hd2] + tl)

type ValidSortedList = list[Element] WHERE is_sorted(lst)

def add_element(existing: ValidSortedList, new_elem: Element) -> ValidSortedList:
    REQUIRES True
    ENSURES len(result) == len(existing) + 1

#TODO
