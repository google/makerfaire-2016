import random
from burger_data import BurgerElement
burger_element_keys = BurgerElement.__members__.keys()


class RandomBurger:
  def __init__(self, max_iterations):
    self.max_iterations = max_iterations
    self.iterations = 0

  # Generate a random, possibly valid burger
  def next_burger(self):
    if self.iterations > self.max_iterations:
      raise StopIteration
    state = BurgerElement.crown
    burger = [ state ]
    while state != BurgerElement.heel:
      c = random.choice(burger_element_keys)
      state = BurgerElement[c]
      burger.append(state)
    self.iterations += 1
    return tuple(burger)
